const iPontoFull = {
  codproduto: 47,
  produto: 'iPonto Full',
};

const iFitness = {
  codproduto: 35,
  produto: 'iFitness',
};

const products = [iFitness, iPontoFull];

const getRandomProduto = () =>
  products[Math.floor(Math.random() * products.length)];

export { products, getRandomProduto };
