export function fn_deteksi_sq(data_api, kode_rumus) {
  return data_api.filter((item) => item.kode_rumus === kode_rumus);
}
export function fn_avg_data(data) {
  const totalAvg = data.reduce(
    (accumulator, currentValue) => accumulator + currentValue.avg,
    0
  );
  const rataRata = totalAvg / data.length;
  return rataRata;
}
