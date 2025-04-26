// src/payment/payment.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as qs from 'qs';
import * as crypto from 'crypto';
import { Payment } from './payment.entity';
import { StatusPayment } from 'src/common/constants/enum';
import { ConfigService } from '@nestjs/config';
import { getVnpConfig } from 'src/config/vnp.config';

@Injectable()
export class PaymentService {
  private readonly vnpConfig;

  constructor(
    @InjectRepository(Payment)
    private paymentRepo: Repository<Payment>,
    private configService: ConfigService,
  ) {
    this.vnpConfig = getVnpConfig();
  }

  async createPayment(courseId: number, userId: number, amount: number) {
    const vnp_TxnRef = Date.now().toString();
    const payment = await this.paymentRepo.save({
      user_id: userId,
      course_id: courseId,
      amount,
      status: StatusPayment.PENDING,
      vnp_txn_ref: vnp_TxnRef,
    });

    const date = new Date();
    const createDate = date.toISOString().replace(/[-:T.Z]/g, '').slice(0, 14);

    let vnp_Params: Record<string, string> = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode: this.vnpConfig.vnp_TmnCode,
      vnp_Locale: 'vn',
      vnp_CurrCode: 'VND',
      vnp_TxnRef: vnp_TxnRef,
      vnp_OrderInfo: `Thanh toán khóa học ${courseId}`,
      vnp_OrderType: 'education',
      vnp_Amount: (amount * 100).toString(),
      vnp_ReturnUrl: this.vnpConfig.vnp_ReturnUrl,
      vnp_IpAddr: '127.0.0.1',
      vnp_CreateDate: createDate,
    };

    vnp_Params = this.sortObject(vnp_Params);
    const signData = qs.stringify(vnp_Params, { encode: false });
    const hmac = crypto.createHmac('sha512', this.vnpConfig.vnp_HashSecret);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    vnp_Params['vnp_SecureHash'] = signed;

    const paymentUrl = `${this.vnpConfig.vnp_Url}?${qs.stringify(vnp_Params, {
      encode: true,
    })}`;

    return { url: paymentUrl };
  }

  async handlePaymentReturn(query: any): Promise<'completed' | 'failed'> {
    const { vnp_TxnRef, vnp_ResponseCode, vnp_SecureHash } = query;

    const secureHash = query['vnp_SecureHash'];
    delete query['vnp_SecureHash'];
    delete query['vnp_SecureHashType'];

    const sortedParams = this.sortObject(query);
    const signData = qs.stringify(sortedParams, { encode: false });
    const hmac = crypto.createHmac('sha512', this.vnpConfig.vnp_HashSecret);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    const isValid = signed === secureHash;

    const payment = await this.paymentRepo.findOne({
      where: { vnp_txn_ref: vnp_TxnRef },
    });

    if (!payment) throw new Error('Payment not found');

    payment.vnp_response_code = vnp_ResponseCode;
    payment.vnp_secure_hash = secureHash;
    payment.updated_at = new Date();
    payment.status =
      isValid && vnp_ResponseCode === '00'
        ? StatusPayment.COMPLETED
        : StatusPayment.FAILED;

    await this.paymentRepo.save(payment);
    return payment.status;
  }

  private sortObject(obj: Record<string, string>) {
    const sorted: Record<string, string> = {};
    const keys = Object.keys(obj).sort();
    keys.forEach((key) => {
      sorted[key] = obj[key];
    });
    return sorted;
  }
}
