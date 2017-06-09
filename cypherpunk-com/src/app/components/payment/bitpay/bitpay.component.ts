import { Component, Input, OnChanges } from '@angular/core';
import { GlobalsService } from '../../../services/globals.service';

@Component({
  selector: 'app-bitpay',
  templateUrl: './bitpay.component.html'
})
export class BitpayComponent implements OnChanges {
  @Input() userId: string;
  @Input() planData;

  env = 'DEV';
  posData = '';
  monthlyData = '';
  annuallyData = '';
  semiannuallyData = '';
  devMonthly = 'm11KRs736FeBMFoMeoSllMbhydqlxA3KrtlO8usqz+WGoLd0HymdBiKlc0x4/1QienTfpxnDWUJLo2RbLWXWYuVb2fIPUK1HC2gn83bhLGRqE2aWA08OdoVxsASvSGDYevME/GaR8eStmb5PjDh/HdO90HFIKtFtGlu+W3z8WNsZje9AA4miSYljc34DY0bfVRc+Vigws0t47TBvc3TsxqAJ8RVubr5BfyN48xl7aEGvnFGuH/+B3qVftQ3V77DBMp6krLSH3uElSNc0TPkcEULF8tEFM+Ql9CUg/DJ1nBvcKDOK+G2goavLUy55u24fqoS4RuFE46v45KMWLbo5QGR9wSyOFQoHUqKI5FuCHrlBdWTZQiHqUdpa2vrQFafY';
  devAnnually = 'm11KRs736FeBMFoMeoSllMbhydqlxA3KrtlO8usqz+WGoLd0HymdBiKlc0x4/1QiyO/0ITRZgRbsNe5mvEeDsng+MWd6NzyPtJCGP88yvqXIke/rJvfbJRwLUI8iOrvqlJOZ2O6W/kVEpIGwP2TuGVpka1dcr3i0m+5R5KiQE0nwSqKLDdaBAJQ2nX4+0ty6SH6n2LOdztwkH3sKOEhDXYLfCkmIbyrpZii5WWmSpkH+IFHFhakVIdeJNhkM+ZILdXimQVtVu3W6rNvkqSS0G73KzJwhMFfmemPQpONuf8+eSgrXtdKfK5z7cu8Tm9zqcoz6G5CbBIVXnAvEjjHqhDB/XGMseAfKaGAD8REV2YCVjXzVVOTTJyMm5PZYC8tx';
  devSemiannually = 'm11KRs736FeBMFoMeoSllMbhydqlxA3KrtlO8usqz+WGoLd0HymdBiKlc0x4/1QiCSdoP9NUTcX3Q+kPsB43Na1VYJ/Bb+VL3c0dkglQUUn/dEBNG+hcmActW+edqE2XoF/0p3kv5NA0riDFtwyyW6LUhA0H07Kb6XeecGIwuHq47Evwi+2uUrQtYI9Ig6J6MBP6kKdQX4KTk8xDWHAwjtmgHzw5fmgpVRXNDNbQwSQ43fQlmbhqn9m9C3ZgncoSfc4jnYOFjJldktQFxmTKsYuoPr7drRkluBqDSTkgbTwwmcrGDft+XrRkJUGf3htp1cFGln5pFS4BYb1dxcMhhi23ZdkKtK+visf++Y84Xsiik8slJ584P+zqW1JZt/+c';

  constructor(private globals: GlobalsService) { }

  ngOnChanges() {
    if (this.globals.ENV === 'PROD') {
      this.env = 'PROD';
      this.monthlyData = this.planData.plans[0].bitpayData;
      this.annuallyData = this.planData.plans[1].bitpayData;
      this.semiannuallyData = this.planData.plans[2].bitpayData;
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
