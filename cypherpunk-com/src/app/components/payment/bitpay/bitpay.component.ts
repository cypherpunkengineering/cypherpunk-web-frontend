import { Component, Input, OnChanges } from '@angular/core';
import { GlobalsService } from '../../../services/globals.service';

@Component({
  selector: 'app-bitpay',
  templateUrl: './bitpay.component.html'
})
export class BitpayComponent implements OnChanges {
  @Input() userId: string;
  @Input() planData;

  posData = '';
  devMonthly = 'rDNH1y1QGetIGfRuWqjAKXLfg/M+yFmdEmL6jDfljpyiMifqDnitepwtuBM1XWsM3JZsJsunyiis3x+PxJNk2tG5DB4yiohqE43caZjUoWV0wl+8HaocQLdwLLXu93Z62ACbxxOWpZGM72GiMcSuTWRURaK7v8SRxe6f9dryg0AwZxT4kZa1dBQVIk4Qx+R7PbWALwXYu11TpiEJWGnFjRYxzpbs79WqKVFX+dzGIrHAsGIfMYjsa66VDGjyc7j+4KHcmRApZIHDSkSzuYzZM7FXqm6XAFpLkM977eWen/yY36COx/z5yDqDeg+t0F+7E0RrQVDyTBjHDVcwlo68IQ=="';
  monthlyData = this.devMonthly;
  devAnnually = 'rDNH1y1QGetIGfRuWqjAKXLfg/M+yFmdEmL6jDfljpyiMifqDnitepwtuBM1XWsM3JZsJsunyiis3x+PxJNk2tG5DB4yiohqE43caZjUoWXOpVB+SNYQuXiLGS4qiuu+TjxqTHwv7zpmMQ1p7tCyhIfb/etWs+DLUim3ODfcMGbz9wUlM+h9TFM6TH2fqrjmz/qqfkqx9SXkPHGEi63wzn52mSOAHM1UUF0cXjOoPfhPLLRkRuHM+I45xlUsTL8wu6adyAymMzqI///Rs1743hnQV+MFjCh0Yrjr+NNGKgqDUdlf7a4w4p7jdAssK8CIvN0zS6NHliZ0V+Tv1J24YQ==';
  annuallyData = this.devAnnually;
  devSemiannually = 'rDNH1y1QGetIGfRuWqjAKXLfg/M+yFmdEmL6jDfljpyiMifqDnitepwtuBM1XWsM3JZsJsunyiis3x+PxJNk2tG5DB4yiohqE43caZjUoWUnDSNdYjQD7BvDvQ9pukYRvqANEc58kXeaC9Noq3t0UcOtAfh2kczNKsv2gpiFkI/8aPf6CYqoiePbm1Qnv0lGoNTYGrLpkM/f2WybURwvOd8if9ISDxiehsQPU3ULJlgifR/rxCvOUmhD07vliIUuF1LMHuBwTVQy4MBJxlafYIFBPso2JeXizI4Vg4MZF9/EEHgGfVmUkNuFsZEitTbgAD+qUJuRlpzh+cImYBT7Hw==';
  semiannuallyData = this.devSemiannually;

  constructor(private globals: GlobalsService) { }

  ngOnChanges() {
    if (this.globals.ENV === 'PROD') {
      this.monthlyData = this.planData.plans[0].bitpayData;
      this.annuallyData = this.planData.plans[1].bitpayData;
      this.semiannuallyData = this.planData[2].bitpayData;
    }
  }

  pay(planDuration, referralCode) {
    let data = { id: this.userId, plan: planDuration, referralCode: referralCode };
    if (!data.referralCode) { delete data.referralCode; }
    this.posData = JSON.stringify(data);

    setTimeout(() => {
      if (planDuration.startsWith('monthly')) {
        document.getElementById('bitpayMonthly').click();
      }
      else if (planDuration.startsWith('annually')) {
        document.getElementById('bitpayAnnual').click();
      }
      else if (planDuration.startsWith('semiannually')) {
        document.getElementById('bitpaySemiannual').click();
      }
    });
  }
}
