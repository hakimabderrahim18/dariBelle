import PDFDocument from "pdfkit";

export const generateOrderInvoice = (order, settings) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: "A4", margin: 40 });
      const buffers = [];

      doc.on("data", (buffer) => buffers.push(buffer));
      doc.on("end", () => resolve(Buffer.concat(buffers)));
      doc.on("error", (err) => reject(err));

      // Brand Colors
      const navy = "#1B1F4A";
      const crimson = "#D42A52";
      const gold = "#F2A81D";
      const gray = "#555555";
      const lightGray = "#F5F5F5";

      // Header Banner
      doc.rect(40, 40, 515, 80).fill(navy);

      doc.fillColor("#FFFFFF").fontSize(22).font("Helvetica-Bold").text("DARI BELLE", 55, 55);
      doc.fillColor(gold).fontSize(9).font("Helvetica").text("LUXURY LIFESTYLE — ARTS DE LA TABLE & VAISSELLE", 55, 82);
      doc.fillColor("#FFFFFF").fontSize(9).font("Helvetica-Oblique").text("« 3AMRI DAREK M3ANA » | « La Beauté a Son Adresse »", 55, 96);

      doc.fillColor("#FFFFFF").fontSize(12).font("Helvetica-Bold").text("BON DE COMMANDE / FACTURE", 320, 55, { align: "right", width: 220 });
      doc.fillColor(gold).fontSize(10).font("Helvetica-Bold").text(`N° ${order.orderNumber}`, 320, 75, { align: "right", width: 220 });
      doc.fillColor("#EEEEEE").fontSize(8).font("Helvetica").text(`Date: ${new Date(order.createdAt).toLocaleDateString("fr-DZ")} ${new Date(order.createdAt).toLocaleTimeString("fr-DZ", { hour: "2-digit", minute: "2-digit" })}`, 320, 92, { align: "right", width: 220 });

      // Store & Customer Info Section
      doc.y = 135;

      // Store Details Box
      doc.rect(40, 135, 250, 95).strokeColor("#E0E0E0").stroke();
      doc.fillColor(navy).fontSize(10).font("Helvetica-Bold").text("Émetteur (Boutique)", 50, 145);
      doc.fillColor(gray).fontSize(8.5).font("Helvetica")
        .text("Dari Belle Tiaret", 50, 160)
        .text("Route Lacadémie, à côté du Printemps", 50, 173)
        .text("Tiaret, Algérie", 50, 186)
        .text("Tél : 06 59 40 84 03 / 05 51 00 70 98", 50, 199)
        .text("Service Client : daribelle.dz@gmail.com", 50, 212);

      // Customer Details Box
      doc.rect(305, 135, 250, 95).strokeColor("#E0E0E0").stroke();
      doc.fillColor(crimson).fontSize(10).font("Helvetica-Bold").text("Destinataire (Client)", 315, 145);
      doc.fillColor(gray).fontSize(8.5).font("Helvetica")
        .text(`Nom : ${order.customer.name}`, 315, 160)
        .text(`Téléphone : ${order.customer.phone}`, 315, 173)
        .text(`Wilaya : ${order.customer.wilaya}`, 315, 186)
        .text(`Commune : ${order.customer.commune}`, 315, 199)
        .text(`Adresse : ${order.customer.address}`, 315, 212);

      // Status & Payment Tag
      doc.y = 245;
      doc.rect(40, 245, 515, 25).fill(lightGray);
      doc.fillColor(navy).fontSize(9).font("Helvetica-Bold").text("Mode de Paiement : ", 50, 252, { continued: true });
      doc.fillColor(crimson).text("Paiement à la livraison (Cash on Delivery - COD)");
      doc.fillColor(navy).text(`Statut Commande : ${order.status.toUpperCase()}`, 380, 252, { align: "right", width: 165 });

      // Table Header
      const tableTop = 285;
      doc.rect(40, tableTop, 515, 22).fill(navy);
      doc.fillColor("#FFFFFF").fontSize(8.5).font("Helvetica-Bold");
      doc.text("Article / Désignation", 50, tableTop + 6, { width: 250 });
      doc.text("Variante", 305, tableTop + 6, { width: 70 });
      doc.text("Qté", 380, tableTop + 6, { width: 35, align: "center" });
      doc.text("Prix Unit.", 420, tableTop + 6, { width: 60, align: "right" });
      doc.text("Total DZD", 485, tableTop + 6, { width: 60, align: "right" });

      // Items Rows
      let itemY = tableTop + 25;
      doc.font("Helvetica").fontSize(8.5);

      order.items.forEach((item, index) => {
        if (index % 2 === 1) {
          doc.rect(40, itemY - 3, 515, 20).fill("#FAFAFA");
        }
        doc.fillColor("#222222");
        doc.text(item.name, 50, itemY, { width: 250, ellipsis: true });
        doc.text(item.variantSku || "Standard", 305, itemY, { width: 70, ellipsis: true });
        doc.text(item.quantity.toString(), 380, itemY, { width: 35, align: "center" });
        doc.text(`${item.price.toLocaleString("fr-DZ")} DA`, 420, itemY, { width: 60, align: "right" });
        doc.text(`${(item.price * item.quantity).toLocaleString("fr-DZ")} DA`, 485, itemY, { width: 60, align: "right" });
        itemY += 20;
      });

      // Totals Box
      doc.y = itemY + 15;
      const totalBoxY = doc.y;

      doc.rect(320, totalBoxY, 235, 80).strokeColor("#E0E0E0").stroke();
      doc.fontSize(9).font("Helvetica");

      doc.fillColor(gray).text("Sous-total :", 330, totalBoxY + 10);
      doc.fillColor("#111111").text(`${order.subtotal.toLocaleString("fr-DZ")} DZD`, 440, totalBoxY + 10, { width: 105, align: "right" });

      doc.fillColor(gray).text("Frais de livraison :", 330, totalBoxY + 25);
      doc.fillColor("#111111").text(`${order.shippingFee.toLocaleString("fr-DZ")} DZD`, 440, totalBoxY + 25, { width: 105, align: "right" });

      if (order.discount > 0) {
        doc.fillColor(crimson).text("Remise (Coupon) :", 330, totalBoxY + 40);
        doc.fillColor(crimson).text(`-${order.discount.toLocaleString("fr-DZ")} DZD`, 440, totalBoxY + 40, { width: 105, align: "right" });
      }

      doc.rect(320, totalBoxY + 55, 235, 25).fill(navy);
      doc.fillColor("#FFFFFF").fontSize(10).font("Helvetica-Bold").text("NET À PAYER :", 330, totalBoxY + 62);
      doc.fillColor(gold).fontSize(11).font("Helvetica-Bold").text(`${order.total.toLocaleString("fr-DZ")} DZD`, 440, totalBoxY + 61, { width: 105, align: "right" });

      // Customer Note if any
      if (order.customer.note) {
        doc.rect(40, totalBoxY, 260, 80).strokeColor("#E0E0E0").stroke();
        doc.fillColor(navy).fontSize(8.5).font("Helvetica-Bold").text("Note client / Instructions de livraison :", 50, totalBoxY + 10);
        doc.fillColor(gray).fontSize(8).font("Helvetica").text(order.customer.note, 50, totalBoxY + 25, { width: 240 });
      }

      // Footer
      const footerY = 740;
      doc.rect(40, footerY, 515, 1).fill("#CCCCCC");
      doc.fillColor(gray).fontSize(7.5).font("Helvetica").text(
        "Merci pour votre confiance ! Dari Belle — Vaisselle de Luxe & Arts de la Table — Tiaret, Algérie",
        40,
        footerY + 10,
        { align: "center", width: 515 }
      );
      doc.text(
        "Pour toute réclamation ou question concernant votre colis, contactez le 06 59 40 84 03 ou 05 51 00 70 98.",
        40,
        footerY + 22,
        { align: "center", width: 515 }
      );

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};
