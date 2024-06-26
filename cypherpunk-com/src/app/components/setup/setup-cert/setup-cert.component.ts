import { Component } from '@angular/core';

@Component({
  selector: 'app-setup-cert',
  templateUrl: './setup-cert.component.html',
  styleUrls: ['./setup-cert.component.css']
})
export class SetupCertComponent {
  cert = [
    '-----BEGIN CERTIFICATE-----',
    'MIIFjzCCA3egAwIBAgIJAJ4lkFo9v0L1MA0GCSqGSIb3DQEBDQUAMF4xCzAJBgNV',
    'BAYTAklTMSIwIAYDVQQKDBlDeXBoZXJwdW5rIFBhcnRuZXJzLCBTbGYuMSswKQYD',
    'VQQDDCJDeXBoZXJwdW5rIFByaXZhY3kgTmV0d29yayBSb290IENBMB4XDTE3MDcx',
    'MDA3NDgyMloXDTM3MDcwNTA3NDgyMlowXjELMAkGA1UEBhMCSVMxIjAgBgNVBAoM',
    'GUN5cGhlcnB1bmsgUGFydG5lcnMsIFNsZi4xKzApBgNVBAMMIkN5cGhlcnB1bmsg',
    'UHJpdmFjeSBOZXR3b3JrIFJvb3QgQ0EwggIiMA0GCSqGSIb3DQEBAQUAA4ICDwAw',
    'ggIKAoICAQDHff48dzt7LoHGWuXLDxb+L54wOKFwdb+O1zhoWgBznk0sBoNi29eM',
    '/4WSibUkRLEPdNcgRZX/RXxsfT/e4sXPT2jOLNPAlTCb3iOvsH7rfgantBbkXO1k',
    'mRzBFhpSe+yekBFoOa3g+qG+XqtuLCHMqkHF1XkFBAlgFD1MoCugadTyxdr7X+Y7',
    'wK1G0C+ZcgyMn6u7U9uZ+JHMkyMAzYA/r0OQOIZjBeojWb/0aVcv00u01CxC4rdO',
    'WxxjukEQ9nA8MGCKOeO8XrBAdK+l5d3tWqovSMp7NEvkSepGrEVuQDwrkgwAdnAL',
    'WaqjBARL/eYXWZ7QaSO3yVu5fI5O/kx8POvPP+si8pJ6TDbiGMKarJNc6cf15dTB',
    'UEVyurgtDLIykYM+hyAqqGzR5Ct6zTvKRCAh47NhJDjS2qeccRSKxppFGcqHMAYJ',
    'dmbfs6SemosAl05aZKcj4ScHLq8Q6z4Vq8KSEdfMy3gWqOCwg7q26Y12gn43sMz/',
    'M9tOq57LT9BJPLMADk65NspKhHS0+pafgDlEre6xVgO/Hn0t7dAvxtvQuW3oTASE',
    'V7qbtoPpxt2s+smTxD0nfFkYS6ixHkr7NrihBehL5t6laNVitAtjfwn9dNk8clR4',
    'H1o0T8CMCsSwBlFrAfvI7Teth3VA5ASCHNsLiaIRW4Gim1afuAXLQwIDAQABo1Aw',
    'TjAdBgNVHQ4EFgQU2y/+YPH5bONje+Z56e0hST9AK5swHwYDVR0jBBgwFoAU2y/+',
    'YPH5bONje+Z56e0hST9AK5swDAYDVR0TBAUwAwEB/zANBgkqhkiG9w0BAQ0FAAOC',
    'AgEAduneV4ubBycREfc2hpmNCZC3heKYQZCMHrzkdHLMa/XTwXEo3tNvJcs88l4F',
    'YsWYbRYQP13SAI3Ff07c02uENYDyMvcmy6q3Z2jiqJ02CVkDNcN/Nd3YREtuk2D5',
    '8UWbGvhsER+JTW3/9zec3baG2I45ipcU+YLOkEjiyQpKA7OI8C4FppGWjVaL3kGO',
    'a08ryOrIvyTyPxxVFmXHIyUfWAKtSGzJvmhpWpX0kF7rQGULZ46Lfy76Td2xtQdE',
    'sxn0aIUqAk3iBV6zT4vN4L/oA4kfY7DxGRJwAUNK8Zk/kObLtwGaGiqrG/3W5N40',
    'qf2fOrsofbBdSZDZjFLZcsJYtSYStAdPuGO3wB91ar8XAgAdrhe+tYpI+k0Kat/i',
    'Cxbh1WoFSnCISDH3xhU0tP5fvOF2WXOcfe67eFbiQyOkDpbO/Cd6d74lnsxNpmaw',
    'NazjFUObdvcucta2wFj3FhpCFQGnSlcUQsT0BS6X+rSgmY+hZ37D4HbziRHFiN4Q',
    'e97IXZopkPpTonFrvVZkFYXWSJdx6odjaNPXrhWH2SwBhCAWGpmypGay2j79sPAJ',
    '0OxQxuLLkR9hloTAwoQY/2gGYLBs/YLRRVtfKN24r/sXnKDFwojaIti4yr5IfQKL',
    'h6fMBiAAKE7CWJG+Y1NQrwPkrJT5QhpjpSL9V1orCUfW/pU=',
    '-----END CERTIFICATE-----',
  ].join('\r\n');

  copy(element: string) {
    let el = (document.getElementById(element)) as HTMLTextAreaElement;

    try {
      el.select();
      document.execCommand('copy');
      el.blur();
    }
    catch(err) {
      alert('Please press Ctrl/Cmd + C to copy');
    }
  }
}
