import UjianStudiBanksoalRoutes from "./ujianstudi/ujianstudi-banksoal-routes";
import UjianStudiPaketsoalRoutes from "./ujianstudi/ujianstudi-paketsoal-routes";

const UjianStudiRoutes = [];

UjianStudiRoutes.push(
    ...UjianStudiBanksoalRoutes,
    ...UjianStudiPaketsoalRoutes,
);

export default UjianStudiRoutes;
