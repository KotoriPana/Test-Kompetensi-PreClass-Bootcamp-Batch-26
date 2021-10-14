let voucher = "";
let belanja,
  diskon,
  kembalian = 0;

function hitungVoucher(voucher, belanja) {
  if (voucher === "DumbWaysJos") {
    if (belanja < 50000) {
      console.log("Minimal belanja Rp 50.000,-");
      return;
    } else {
      diskon = belanja * 0.221;
      if (diskon > 20000) {
        diskon = 20000;
      }

      kembalian = belanja - diskon;

      console.log(`Uang yang harus dibayar : ${belanja}`);
      console.log(`Diskon : ${diskon}`);
      console.log(`kembalian : ${kembalian}`);
    }
  } else if (voucher === "DumbWaysMantap") {
    if (belanja < 80000) {
      console.log("Minimal belanja Rp 80.000,-");
      return;
    } else {
      diskon = belanja * 0.3;
      if (diskon > 40000) {
        diskon = 40000;
      }

      kembalian = belanja - diskon;
      console.log(`Uang yang harus dibayar : ${belanja}`);
      console.log(`Diskon : ${diskon}`);
      console.log(`kembalian : ${kembalian}`);
    }
  }
}

hitungVoucher("DumbWaysJos", 49999);
hitungVoucher("DumbWaysJos", 80000);
hitungVoucher("DumbWaysJos", 100000);
hitungVoucher("DumbWaysMantap", 79999);
hitungVoucher("DumbWaysMantap", 100000);
hitungVoucher("DumbWaysMantap", 150000);
