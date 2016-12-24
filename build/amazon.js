window.amazonPayments = {
  billingAgreement: {},
  callback: function() {},
  init: function(callback) {
    window.amazonPayments.callback = callback;
    var authRequest;
    window.OffAmazonPayments.Button(
      'AmazonPayButton',
      'A2FF2JPNM9GYDJ', {
        type:  'PwA',
        color: 'Gold',
        size:  'medium',
        authorization: function() {
          let loginOptions = {
            scope: 'profile',
            popup: 'true'
          };
          authRequest = window.amazon.Login.authorize(loginOptions);
          window.amazonPayments.createWallet();
        },
        onError: function(error) { console.log(error); }
      }
    );
  },
  createWallet: function() {
    var billingAgreementId;
    document.getElementById('walletWidgetDiv').style.display = 'block';

    new window.OffAmazonPayments.Widgets.Wallet({
      sellerId: 'A2FF2JPNM9GYDJ',
      onReady: function(billingAgreement) {
        billingAgreementId = billingAgreement.getAmazonBillingAgreementId();
        console.log(billingAgreementId);
      },
      agreementType: 'BillingAgreement',
      design: { designMode: 'responsive' },
      onPaymentSelect: function(billingAgreement) {
        // Replace this code with the action that you want to perform
        // after the payment method is selected.
        window.amazonPayments.billingAgreement = billingAgreement;
        window.amazonPayments.createRecurring(billingAgreementId);
      },
      onError: function(error) { console.log(error); }
    }).bind('walletWidgetDiv');
  },
  createRecurring: function(billingAgreementId) {
    var buyerBillingAgreementConsentStatus;
    document.getElementById('consentWidgetDiv').style.display = 'block';

    new window.OffAmazonPayments.Widgets.Consent({
      sellerId: 'A2FF2JPNM9GYDJ',
      // amazonBillingAgreementId obtained from the Amazon Address Book widget.
      amazonBillingAgreementId: billingAgreementId,
      design: { designMode: 'responsive' },
      onReady: function(billingAgreementConsentStatus){
        // Called after widget renders
        buyerBillingAgreementConsentStatus =
        billingAgreementConsentStatus.getConsentStatus();
        // getConsentStatus returns true or false
        // true – checkbox is selected
        // false – checkbox is unselected - default

        if (buyerBillingAgreementConsentStatus === 'true') {
          window.amazonPayments.callback(billingAgreementId);
          document.getElementById('payWithAmazon').style.display = 'inline';
        }
      },
      onConsent: function(billingAgreementConsentStatus) {
        buyerBillingAgreementConsentStatus =
        billingAgreementConsentStatus.getConsentStatus();
        // getConsentStatus returns true or false
        // true – checkbox is selected – buyer has consented
        // false – checkbox is unselected – buyer has not consented

        // Replace this code with the action that you want to perform
        // after the consent checkbox is selected/unselected.
        if (buyerBillingAgreementConsentStatus === 'true') {
          window.amazonPayments.callback(window.amazonPayments.billingAgreement);
          document.getElementById('payWithAmazon').style.display = 'inline';
        }
        else {
          window.alert('Please allow for future payments to join Cypherpunk.');
          document.getElementById('payWithAmazon').style.display = 'none';
        }
      },
      onError: function(error) { console.log(error); }
    }).bind('consentWidgetDiv');
  }
};
