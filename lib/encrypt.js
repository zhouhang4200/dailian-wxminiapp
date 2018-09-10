var dbits, canary = 0xdeadbeefcafe, j_lm = 15715070 == (canary & 16777215);

function BigInteger(a, b, c) {
  null != a && ("number" == typeof a ? this.fromNumber(a, b, c) : null == b && "string" != typeof a ? this.fromString(a, 256) : this.fromString(a, b))
}

function nbi() {
  return new BigInteger(null)
}

function am1(a, b, c, d, e, f) {
  for (; 0 <= --f;) {
    var g = b * this[a++] + c[d] + e;
    e = Math.floor(g / 67108864);
    c[d++] = g & 67108863
  }
  return e
}

function am2(a, b, c, d, e, f) {
  var g = b & 32767;
  for (b >>= 15; 0 <= --f;) {
    var h = this[a] & 32767, k = this[a++] >> 15, m = b * h + k * g,
      h = g * h + ((m & 32767) << 15) + c[d] + (e & 1073741823);
    e = (h >>> 30) + (m >>> 15) + b * k + (e >>> 30);
    c[d++] = h & 1073741823
  }
  return e
}

function am3(a, b, c, d, e, f) {
  var g = b & 16383;
  for (b >>= 14; 0 <= --f;) {
    var h = this[a] & 16383, k = this[a++] >> 14, m = b * h + k * g, h = g * h + ((m & 16383) << 14) + c[d] + e;
    e = (h >> 28) + (m >> 14) + b * k;
    c[d++] = h & 268435455
  }
  return e
}

BigInteger.prototype.am = am3, dbits = 28;
BigInteger.prototype.DB = dbits;
BigInteger.prototype.DM = (1 << dbits) - 1;
BigInteger.prototype.DV = 1 << dbits;
var BI_FP = 52;
BigInteger.prototype.FV = Math.pow(2, BI_FP);
BigInteger.prototype.F1 = BI_FP - dbits;
BigInteger.prototype.F2 = 2 * dbits - BI_FP;
var BI_RM = "0123456789abcdefghijklmnopqrstuvwxyz", BI_RC = [], rr, vv;
rr = 48;
for (vv = 0; 9 >= vv; ++vv) BI_RC[rr++] = vv;
rr = 97;
for (vv = 10; 36 > vv; ++vv) BI_RC[rr++] = vv;
rr = 65;
for (vv = 10; 36 > vv; ++vv) BI_RC[rr++] = vv;

function int2char(a) {
  return BI_RM.charAt(a)
}

function intAt(a, b) {
  a = BI_RC[a.charCodeAt(b)];
  return null == a ? -1 : a
}

function bnpCopyTo(a) {
  for (var b = this.t - 1; 0 <= b; --b) a[b] = this[b];
  a.t = this.t;
  a.s = this.s
}

function bnpFromInt(a) {
  this.t = 1;
  this.s = 0 > a ? -1 : 0;
  0 < a ? this[0] = a : -1 > a ? this[0] = a + this.DV : this.t = 0
}

function nbv(a) {
  var b = nbi();
  b.fromInt(a);
  return b
}

function bnpFromString(a, b) {
  if (16 == b) b = 4; else if (8 == b) b = 3; else if (256 == b) b = 8; else if (2 == b) b = 1; else if (32 == b) b = 5; else if (4 == b) b = 2; else {
    this.fromRadix(a, b);
    return
  }
  this.s = this.t = 0;
  for (var c = a.length, d = !1, e = 0; 0 <= --c;) {
    var f = 8 == b ? a[c] & 255 : intAt(a, c);
    0 > f ? "-" == a.charAt(c) && (d = !0) : (d = !1, 0 == e ? this[this.t++] = f : e + b > this.DB ? (this[this.t - 1] |= (f & (1 << this.DB - e) - 1) << e, this[this.t++] = f >> this.DB - e) : this[this.t - 1] |= f << e, e += b, e >= this.DB && (e -= this.DB))
  }
  8 == b && 0 != (a[0] & 128) && (this.s = -1, 0 < e && (this[this.t - 1] |= (1 << this.DB -
    e) - 1 << e));
  this.clamp();
  d && BigInteger.ZERO.subTo(this, this)
}

function bnpClamp() {
  for (var a = this.s & this.DM; 0 < this.t && this[this.t - 1] == a;) --this.t
}

function bnToString(a) {
  if (0 > this.s) return "-" + this.negate().toString(a);
  if (16 == a) a = 4; else if (8 == a) a = 3; else if (2 == a) a = 1; else if (32 == a) a = 5; else if (4 == a) a = 2; else return this.toRadix(a);
  var b = (1 << a) - 1, c, d = !1, e = "", f = this.t, g = this.DB - f * this.DB % a;
  if (0 < f--) for (g < this.DB && 0 < (c = this[f] >> g) && (d = !0, e = int2char(c)); 0 <= f;) g < a ? (c = (this[f] & (1 << g) - 1) << a - g, c |= this[--f] >> (g += this.DB - a)) : (c = this[f] >> (g -= a) & b, 0 >= g && (g += this.DB, --f)), 0 < c && (d = !0), d && (e += int2char(c));
  return d ? e : "0"
}

function bnNegate() {
  var a = nbi();
  BigInteger.ZERO.subTo(this, a);
  return a
}

function bnAbs() {
  return 0 > this.s ? this.negate() : this
}

function bnCompareTo(a) {
  var b = this.s - a.s;
  if (0 != b) return b;
  var c = this.t, b = c - a.t;
  if (0 != b) return 0 > this.s ? -b : b;
  for (; 0 <= --c;) if (0 != (b = this[c] - a[c])) return b;
  return 0
}

function nbits(a) {
  var b = 1, c;
  0 != (c = a >>> 16) && (a = c, b += 16);
  0 != (c = a >> 8) && (a = c, b += 8);
  0 != (c = a >> 4) && (a = c, b += 4);
  0 != (c = a >> 2) && (a = c, b += 2);
  0 != a >> 1 && (b += 1);
  return b
}

function bnBitLength() {
  return 0 >= this.t ? 0 : this.DB * (this.t - 1) + nbits(this[this.t - 1] ^ this.s & this.DM)
}

function bnpDLShiftTo(a, b) {
  var c;
  for (c = this.t - 1; 0 <= c; --c) b[c + a] = this[c];
  for (c = a - 1; 0 <= c; --c) b[c] = 0;
  b.t = this.t + a;
  b.s = this.s
}

function bnpDRShiftTo(a, b) {
  for (var c = a; c < this.t; ++c) b[c - a] = this[c];
  b.t = Math.max(this.t - a, 0);
  b.s = this.s
}

function bnpLShiftTo(a, b) {
  var c = a % this.DB, d = this.DB - c, e = (1 << d) - 1;
  a = Math.floor(a / this.DB);
  var f = this.s << c & this.DM, g;
  for (g = this.t - 1; 0 <= g; --g) b[g + a + 1] = this[g] >> d | f, f = (this[g] & e) << c;
  for (g = a - 1; 0 <= g; --g) b[g] = 0;
  b[a] = f;
  b.t = this.t + a + 1;
  b.s = this.s;
  b.clamp()
}

function bnpRShiftTo(a, b) {
  b.s = this.s;
  var c = Math.floor(a / this.DB);
  if (c >= this.t) b.t = 0; else {
    a %= this.DB;
    var d = this.DB - a, e = (1 << a) - 1;
    b[0] = this[c] >> a;
    for (var f = c + 1; f < this.t; ++f) b[f - c - 1] |= (this[f] & e) << d, b[f - c] = this[f] >> a;
    0 < a && (b[this.t - c - 1] |= (this.s & e) << d);
    b.t = this.t - c;
    b.clamp()
  }
}

function bnpSubTo(a, b) {
  for (var c = 0, d = 0, e = Math.min(a.t, this.t); c < e;) d += this[c] - a[c], b[c++] = d & this.DM, d >>= this.DB;
  if (a.t < this.t) {
    for (d -= a.s; c < this.t;) d += this[c], b[c++] = d & this.DM, d >>= this.DB;
    d += this.s
  } else {
    for (d += this.s; c < a.t;) d -= a[c], b[c++] = d & this.DM, d >>= this.DB;
    d -= a.s
  }
  b.s = 0 > d ? -1 : 0;
  -1 > d ? b[c++] = this.DV + d : 0 < d && (b[c++] = d);
  b.t = c;
  b.clamp()
}

function bnpMultiplyTo(a, b) {
  var c = this.abs(), d = a.abs(), e = c.t;
  for (b.t = e + d.t; 0 <= --e;) b[e] = 0;
  for (e = 0; e < d.t; ++e) b[e + c.t] = c.am(0, d[e], b, e, 0, c.t);
  b.s = 0;
  b.clamp();
  this.s != a.s && BigInteger.ZERO.subTo(b, b)
}

function bnpSquareTo(a) {
  for (var b = this.abs(), c = a.t = 2 * b.t; 0 <= --c;) a[c] = 0;
  for (c = 0; c < b.t - 1; ++c) {
    var d = b.am(c, b[c], a, 2 * c, 0, 1);
    (a[c + b.t] += b.am(c + 1, 2 * b[c], a, 2 * c + 1, d, b.t - c - 1)) >= b.DV && (a[c + b.t] -= b.DV, a[c + b.t + 1] = 1)
  }
  0 < a.t && (a[a.t - 1] += b.am(c, b[c], a, 2 * c, 0, 1));
  a.s = 0;
  a.clamp()
}

function bnpDivRemTo(a, b, c) {
  var d = a.abs();
  if (!(0 >= d.t)) {
    var e = this.abs();
    if (e.t < d.t) null != b && b.fromInt(0), null != c && this.copyTo(c); else {
      null == c && (c = nbi());
      var f = nbi(), g = this.s;
      a = a.s;
      var h = this.DB - nbits(d[d.t - 1]);
      0 < h ? (d.lShiftTo(h, f), e.lShiftTo(h, c)) : (d.copyTo(f), e.copyTo(c));
      d = f.t;
      e = f[d - 1];
      if (0 != e) {
        var k = e * (1 << this.F1) + (1 < d ? f[d - 2] >> this.F2 : 0), m = this.FV / k, k = (1 << this.F1) / k,
          r = 1 << this.F2, n = c.t, p = n - d, l = null == b ? nbi() : b;
        f.dlShiftTo(p, l);
        0 <= c.compareTo(l) && (c[c.t++] = 1, c.subTo(l, c));
        BigInteger.ONE.dlShiftTo(d,
          l);
        for (l.subTo(f, f); f.t < d;) f[f.t++] = 0;
        for (; 0 <= --p;) {
          var q = c[--n] == e ? this.DM : Math.floor(c[n] * m + (c[n - 1] + r) * k);
          if ((c[n] += f.am(0, q, c, p, 0, d)) < q) for (f.dlShiftTo(p, l), c.subTo(l, c); c[n] < --q;) c.subTo(l, c)
        }
        null != b && (c.drShiftTo(d, b), g != a && BigInteger.ZERO.subTo(b, b));
        c.t = d;
        c.clamp();
        0 < h && c.rShiftTo(h, c);
        0 > g && BigInteger.ZERO.subTo(c, c)
      }
    }
  }
}

function bnMod(a) {
  var b = nbi();
  this.abs().divRemTo(a, null, b);
  0 > this.s && 0 < b.compareTo(BigInteger.ZERO) && a.subTo(b, b);
  return b
}

function Classic(a) {
  this.m = a
}

function cConvert(a) {
  return 0 > a.s || 0 <= a.compareTo(this.m) ? a.mod(this.m) : a
}

function cRevert(a) {
  return a
}

function cReduce(a) {
  a.divRemTo(this.m, null, a)
}

function cMulTo(a, b, c) {
  a.multiplyTo(b, c);
  this.reduce(c)
}

function cSqrTo(a, b) {
  a.squareTo(b);
  this.reduce(b)
}

Classic.prototype.convert = cConvert;
Classic.prototype.revert = cRevert;
Classic.prototype.reduce = cReduce;
Classic.prototype.mulTo = cMulTo;
Classic.prototype.sqrTo = cSqrTo;

function bnpInvDigit() {
  if (1 > this.t) return 0;
  var a = this[0];
  if (0 == (a & 1)) return 0;
  var b = a & 3, b = b * (2 - (a & 15) * b) & 15, b = b * (2 - (a & 255) * b) & 255,
    b = b * (2 - ((a & 65535) * b & 65535)) & 65535, b = b * (2 - a * b % this.DV) % this.DV;
  return 0 < b ? this.DV - b : -b
}

function Montgomery(a) {
  this.m = a;
  this.mp = a.invDigit();
  this.mpl = this.mp & 32767;
  this.mph = this.mp >> 15;
  this.um = (1 << a.DB - 15) - 1;
  this.mt2 = 2 * a.t
}

function montConvert(a) {
  var b = nbi();
  a.abs().dlShiftTo(this.m.t, b);
  b.divRemTo(this.m, null, b);
  0 > a.s && 0 < b.compareTo(BigInteger.ZERO) && this.m.subTo(b, b);
  return b
}

function montRevert(a) {
  var b = nbi();
  a.copyTo(b);
  this.reduce(b);
  return b
}

function montReduce(a) {
  for (; a.t <= this.mt2;) a[a.t++] = 0;
  for (var b = 0; b < this.m.t; ++b) {
    var c = a[b] & 32767, d = c * this.mpl + ((c * this.mph + (a[b] >> 15) * this.mpl & this.um) << 15) & a.DM,
      c = b + this.m.t;
    for (a[c] += this.m.am(0, d, a, b, 0, this.m.t); a[c] >= a.DV;) a[c] -= a.DV, a[++c]++
  }
  a.clamp();
  a.drShiftTo(this.m.t, a);
  0 <= a.compareTo(this.m) && a.subTo(this.m, a)
}

function montSqrTo(a, b) {
  a.squareTo(b);
  this.reduce(b)
}

function montMulTo(a, b, c) {
  a.multiplyTo(b, c);
  this.reduce(c)
}

Montgomery.prototype.convert = montConvert;
Montgomery.prototype.revert = montRevert;
Montgomery.prototype.reduce = montReduce;
Montgomery.prototype.mulTo = montMulTo;
Montgomery.prototype.sqrTo = montSqrTo;

function bnpIsEven() {
  return 0 == (0 < this.t ? this[0] & 1 : this.s)
}

function bnpExp(a, b) {
  if (4294967295 < a || 1 > a) return BigInteger.ONE;
  var c = nbi(), d = nbi(), e = b.convert(this), f = nbits(a) - 1;
  for (e.copyTo(c); 0 <= --f;) if (b.sqrTo(c, d), 0 < (a & 1 << f)) b.mulTo(d, e, c); else var g = c, c = d, d = g;
  return b.revert(c)
}

function bnModPowInt(a, b) {
  b = 256 > a || b.isEven() ? new Classic(b) : new Montgomery(b);
  return this.exp(a, b)
}

BigInteger.prototype.copyTo = bnpCopyTo;
BigInteger.prototype.fromInt = bnpFromInt;
BigInteger.prototype.fromString = bnpFromString;
BigInteger.prototype.clamp = bnpClamp;
BigInteger.prototype.dlShiftTo = bnpDLShiftTo;
BigInteger.prototype.drShiftTo = bnpDRShiftTo;
BigInteger.prototype.lShiftTo = bnpLShiftTo;
BigInteger.prototype.rShiftTo = bnpRShiftTo;
BigInteger.prototype.subTo = bnpSubTo;
BigInteger.prototype.multiplyTo = bnpMultiplyTo;
BigInteger.prototype.squareTo = bnpSquareTo;
BigInteger.prototype.divRemTo = bnpDivRemTo;
BigInteger.prototype.invDigit = bnpInvDigit;
BigInteger.prototype.isEven = bnpIsEven;
BigInteger.prototype.exp = bnpExp;
BigInteger.prototype.toString = bnToString;
BigInteger.prototype.negate = bnNegate;
BigInteger.prototype.abs = bnAbs;
BigInteger.prototype.compareTo = bnCompareTo;
BigInteger.prototype.bitLength = bnBitLength;
BigInteger.prototype.mod = bnMod;
BigInteger.prototype.modPowInt = bnModPowInt;
BigInteger.ZERO = nbv(0);
BigInteger.ONE = nbv(1);

function Arcfour() {
  this.j = this.i = 0;
  this.S = []
}

function ARC4init(a) {
  var b, c, d;
  for (b = 0; 256 > b; ++b) this.S[b] = b;
  for (b = c = 0; 256 > b; ++b) c = c + this.S[b] + a[b % a.length] & 255, d = this.S[b], this.S[b] = this.S[c], this.S[c] = d;
  this.j = this.i = 0
}

function ARC4next() {
  var a;
  this.i = this.i + 1 & 255;
  this.j = this.j + this.S[this.i] & 255;
  a = this.S[this.i];
  this.S[this.i] = this.S[this.j];
  this.S[this.j] = a;
  return this.S[a + this.S[this.i] & 255]
}

Arcfour.prototype.init = ARC4init;
Arcfour.prototype.next = ARC4next;

function prng_newstate() {
  return new Arcfour
}

var rng_psize = 256, rng_state, rng_pool, rng_pptr;

function rng_seed_int(a) {
  rng_pool[rng_pptr++] ^= a & 255;
  rng_pool[rng_pptr++] ^= a >> 8 & 255;
  rng_pool[rng_pptr++] ^= a >> 16 & 255;
  rng_pool[rng_pptr++] ^= a >> 24 & 255;
  rng_pptr >= rng_psize && (rng_pptr -= rng_psize)
}

function rng_seed_time() {
  rng_seed_int((new Date).getTime())
}

if (null == rng_pool) {
  rng_pool = [];
  rng_pptr = 0;
  var t;
  // if (window.crypto && window.crypto.getRandomValues) {
  //   var ua = new Uint8Array(32);
  //   window.crypto.getRandomValues(ua);
  //   for (t = 0; 32 > t; ++t) rng_pool[rng_pptr++] = ua[t]
  // }
  // if ("Netscape" == navigator.appName && "5" > navigator.appVersion && window.crypto) {
  //   var z = window.crypto.random(32);
  //   for (t = 0; t < z.length; ++t) rng_pool[rng_pptr++] = z.charCodeAt(t) & 255
  // }
  for (; rng_pptr < rng_psize;) t = Math.floor(65536 * Math.random()), rng_pool[rng_pptr++] = t >>> 8, rng_pool[rng_pptr++] = t & 255;
  rng_pptr = 0;
  rng_seed_time()
}

function rng_get_byte() {
  if (null == rng_state) {
    rng_seed_time();
    rng_state = prng_newstate();
    rng_state.init(rng_pool);
    for (rng_pptr = 0; rng_pptr < rng_pool.length; ++rng_pptr) rng_pool[rng_pptr] = 0;
    rng_pptr = 0
  }
  return rng_state.next()
}

function rng_get_bytes(a) {
  var b;
  for (b = 0; b < a.length; ++b) a[b] = rng_get_byte()
}

function SecureRandom() {
}

SecureRandom.prototype.nextBytes = rng_get_bytes;

function parseBigInt(a, b) {
  return new BigInteger(a, b)
}

function linebrk(a, b) {
  for (var c = "", d = 0; d + b < a.length;) c += a.substring(d, d + b) + "\n", d += b;
  return c + a.substring(d, a.length)
}

function byte2Hex(a) {
  return 16 > a ? "0" + a.toString(16) : a.toString(16)
}

function pkcs1pad2(a, b) {
  if (b < a.length + 11) return alert("Message too long for RSA"), null;
  for (var c = [], d = a.length - 1; 0 <= d && 0 < b;) {
    var e = a.charCodeAt(d--);
    128 > e ? c[--b] = e : 127 < e && 2048 > e ? (c[--b] = e & 63 | 128, c[--b] = e >> 6 | 192) : (c[--b] = e & 63 | 128, c[--b] = e >> 6 & 63 | 128, c[--b] = e >> 12 | 224)
  }
  c[--b] = 0;
  a = new SecureRandom;
  for (d = []; 2 < b;) {
    for (d[0] = 0; 0 == d[0];) a.nextBytes(d);
    c[--b] = d[0]
  }
  c[--b] = 2;
  c[--b] = 0;
  return new BigInteger(c)
}

function RSAKey() {
  this.n = null;
  this.e = 0;
  this.coeff = this.dmq1 = this.dmp1 = this.q = this.p = this.d = null
}

function RSASetPublic(a, b) {
  null != a && null != b && 0 < a.length && 0 < b.length ? (this.n = parseBigInt(a, 16), this.e = parseInt(b, 16)) : alert("Invalid RSA public key")
}

function RSADoPublic(a) {
  return a.modPowInt(this.e, this.n)
}

function RSAEncrypt(a) {
  a = pkcs1pad2(a, this.n.bitLength() + 7 >> 3);
  if (null == a) return null;
  a = this.doPublic(a);
  if (null == a) return null;
  a = a.toString(16);
  return 0 == (a.length & 1) ? a : "0" + a
}

RSAKey.prototype.doPublic = RSADoPublic;
RSAKey.prototype.setPublic = RSASetPublic;
RSAKey.prototype.encrypt = RSAEncrypt;

function encrypt(a) {
  var b = new RSAKey;
  b.setPublic("A96AA6B55B7A379EED416C0DF7C666C2A79D9CC5DA5DBAF6B28B13C6318785DF771C02DA5A81D8D3A08A3C7FF6E1E4918021922284EC7F50F97B36D72A8D9D0EE9C1BC12EA0F27519DA3F41EFAE36DCD25A623F4B52300D6D06016E654CFD57F0D3BDBB8355C5E6D77EBD5B7BAC59A6796E844329D92290119AC0F3D771FF5E7", "10001");
  return b.encrypt(a)
};

if (typeof define === 'function' && typeof define.amd === 'object' && define.amd) {

  // AMD. Register as an anonymous module.
  define(function () {
    return encrypt;
  });
} else if (typeof module !== 'undefined' && module.exports) {
  module.exports = encrypt;
} else {
  window.base64 = encrypt;
}
