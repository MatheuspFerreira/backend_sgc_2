const isRevendaInativa = (user: any) => user.ativa !== 'T';

const isTecnicoRevendaInativo = (user: any) => user.inativo === 'T';

const isAtendenteInativo = (user: any) => user.ativo === 'N';

const checkDic = {
  revenda: isRevendaInativa,
  tecnicoRevenda: isTecnicoRevendaInativo,
  atendente: isAtendenteInativo,
};

export default function checkcheckEstaInativo(user: any, type: string) {
  return checkDic[type](user);
}
