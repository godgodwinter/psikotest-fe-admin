import UjianStudiBanksoalRoutes from "./ujianstudi/ujianstudi-banksoal-routes";
import UjianStudiPaketsoalRoutes from "./ujianstudi/ujianstudi-paketsoal-routes";
import UjianKhususBanksoalRoutes from "./ujiankhusus/ujiankhusus-banksoal-routes";
import UjianKhususPaketRoutes from "./ujiankhusus/ujiankhusus-paketsoal-routes";

const UjianStudiRoutes = [];

UjianStudiRoutes.push(
  ...UjianStudiBanksoalRoutes,
  ...UjianStudiPaketsoalRoutes,
  ...UjianKhususBanksoalRoutes,
  ...UjianKhususPaketRoutes
);

export default UjianStudiRoutes;
