const codRevendaDic = {
  revenda: (requester: any) => parseInt(requester.id, 10),
  tecnicoRevenda: (requester: any) => parseInt(requester.id, 10),
  atendente: () => null,
};

export default function getCodigoRevenda(requester: any) {
  return codRevendaDic[requester.type](requester);
}
