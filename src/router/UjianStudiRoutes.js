import UjianStudiBanksoalRoutes from "./ujianstudi/ujianstudi-banksoal-routes";
import UjianStudiPaketsoalRoutes from "./ujianstudi/ujianstudi-paketsoal-routes";
import UjianKhususBanksoalRoutes from "./ujiankhusus/ujiankhusus-banksoal-routes";
import UjianKhususPaketRoutes from "./ujiankhusus/ujiankhusus-paketsoal-routes";
import ujiancfitPaketsoalRoutes from "./ujiancfit/ujiancfit-paketsoal-routes";
import ujianmmpiPaketsoalRoutes from "./ujianmmpi/ujianmmpi-paketsoal-routes";

const UjianStudiRoutes = [];

UjianStudiRoutes.push(
  // !ujian studi
  ...UjianStudiBanksoalRoutes,
  ...UjianStudiPaketsoalRoutes,
  //! ujian khusus
  ...UjianKhususBanksoalRoutes,
  ...UjianKhususPaketRoutes,
  // !cfit
  ...ujiancfitPaketsoalRoutes,
  ...ujianmmpiPaketsoalRoutes
);

export default UjianStudiRoutes;
