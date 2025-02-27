import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { QRCodeSVG } from 'qrcode.react';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 12,
    fontFamily: 'Helvetica'
  },
  header: {
    marginBottom: 20,
    borderBottomWidth: 1,
    paddingBottom: 10,
    textAlign: 'center'
  },
  companyName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4
  },
  section: {
    marginBottom: 15
  },
  flexRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    paddingBottom: 5,
    marginBottom: 5
  },
  tableRow: {
    flexDirection: 'row',
    marginBottom: 3
  },
  colDescription: {
    width: '60%'
  },
  colQty: {
    width: '15%',
    textAlign: 'right'
  },
  colPrice: {
    width: '25%',
    textAlign: 'right'
  },
  totalSection: {
    marginTop: 15,
    borderTopWidth: 1,
    paddingTop: 10
  }
});

export default function A4InvoicePDF({ invoice }: { invoice: any }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.companyName}>O'MEGA SERVICES</Text>
          <Text>400 Rue nationale, 69400 Villefranche s/s</Text>
          <Text>Tel: 0986608980 | TVA: FR123456789</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.flexRow}>
            <Text>Invoice #: {invoice.invoiceNumber}</Text>
            <Text>Date: {new Date(invoice.date).toLocaleDateString()}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text>Bill to:</Text>
          <Text>{invoice.customer.name}</Text>
          <Text>{invoice.customer.address}</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.tableHeader}>
            <Text style={styles.colDescription}>Description</Text>
            <Text style={styles.colQty}>Qty</Text>
            <Text style={styles.colPrice}>Price</Text>
          </View>
          
          {invoice.items.map((item: any, index: number) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.colDescription}>{item.name}</Text>
              <Text style={styles.colQty}>{item.quantity}</Text>
              <Text style={styles.colPrice}>€{(item.price * item.quantity).toFixed(2)}</Text>
            </View>
          ))}
        </View>

        <View style={styles.totalSection}>
          <View style={styles.flexRow}>
            <Text>Subtotal:</Text>
            <Text>€{invoice.subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.flexRow}>
            <Text>Tax (20%):</Text>
            <Text>€{invoice.tax.toFixed(2)}</Text>
          </View>
          <View style={styles.flexRow}>
            <Text style={{ fontWeight: 'bold' }}>Total:</Text>
            <Text style={{ fontWeight: 'bold' }}>€{invoice.total.toFixed(2)}</Text>
          </View>
        </View>

        <View style={{ marginTop: 20, textAlign: 'center' }}>
          <QRCodeSVG 
            value={JSON.stringify({
              invoice: invoice.invoiceNumber,
              total: invoice.total,
              date: invoice.date
            })}
            size={80}
          />
          <Text style={{ fontSize: 10, marginTop: 5 }}>Scan to verify invoice</Text>
        </View>
      </Page>
    </Document>
  );
}
