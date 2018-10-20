nnjs.functions = {
  sigmoid: function(x) {
    return 1 / (1 + Math.exp(-x));
  },

  sigmoid_prime: function(x) {
    return nnjs.functions.sigmoid(x) * (1 - nnjs.functions.sigmoid(x));
  },

  relu: function(x) {
    if (x < 0) {
      return 0;
    } else {
      return x;
    }
  },

  relu_prime: function(x) {
    if (x < 0) {
      return 0;
    } else {
      return 1;
    }
  },

  soft_relu: function(x) {
    return Math.log(1 + Math.exp(x));
  },

  soft_relu_prime: function(x) {
    return 1 / (1 + Math.exp(x)) * Math.exp(x);
  },
};
