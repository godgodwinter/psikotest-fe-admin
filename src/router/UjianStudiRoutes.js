import UjianStudiBanksoalRoutes from "./ujianstudi/ujianstudi-banksoal-routes";
import UjianStudiPaketsoalRoutes from "./ujianstudi/ujianstudi-paketsoal-routes";
import UjianKhususBanksoalRoutes from "./ujiankhusus/ujiankhusus-routes";

const UjianStudiRoutes = [];

UjianStudiRoutes.push(
  ...UjianStudiBanksoalRoutes,
  ...UjianStudiPaketsoalRoutes,
  ...UjianKhususBanksoalRoutes
);

export default UjianStudiRoutes;
