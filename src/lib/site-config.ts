// Configuração central da 77 Drive — edite aqui links e informações legais.
export const SITE = {
  name: "77 Drive",
  tagline: "Juntos por uma mobilidade mais justa.",
  links: {
    android: "https://play.google.com/store/apps/details?id=com.app.yyrfwb77drive",
    ios: "https://apps.apple.com/br/app/77-drive-p-passageiros/id6738871125",
    whatsapp: "https://wa.me/+5577991945097",
    instagram: "https://www.instagram.com/app77drive/",
    // Motoristas: preencha quando existirem. Enquanto vazio, o CTA usa o WhatsApp.
    driverAndroid: "",
    driverIos: "",
    driverSignup: "",
    privacy: "#", // Política de Privacidade (a criar)
    terms: "#", // Termos de Uso (a criar)
    lgpd: "#", // LGPD (a criar)
  },
  legal: {
    // Não preenchidos de propósito — informe os dados reais.
    companyName: "",
    cnpj: "",
    address: "",
  },
};

export const driverLink = () => SITE.links.driverSignup || SITE.links.whatsapp;
