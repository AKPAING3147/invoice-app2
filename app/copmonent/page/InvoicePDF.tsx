import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: { flexDirection: 'column', backgroundColor: '#FFFFFF', padding: 30, fontFamily: 'Helvetica' },
    header: { fontSize: 24, marginBottom: 20, textAlign: 'center', fontWeight: 'bold' },
    subHeader: { fontSize: 12, marginBottom: 5, color: '#555' },
    tableContainer: { marginTop: 20 },
    row: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#EEE', paddingBottom: 8, paddingTop: 8, alignItems: 'center' },
    headerRow: { flexDirection: 'row', borderBottomWidth: 2, borderBottomColor: '#333', paddingBottom: 8, paddingTop: 8, backgroundColor: '#f8f9fa' },
    cell: { flex: 1, fontSize: 10, textAlign: 'right' },
    cellLeft: { flex: 2, fontSize: 10, textAlign: 'left' },
    totalSection: { marginTop: 30, alignItems: 'flex-end', borderTopWidth: 1, borderTopColor: '#333', paddingTop: 10 },
    totalRow: { flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 5 },
    totalLabel: { width: 100, fontSize: 11, textAlign: 'right', marginRight: 10 },
    totalValue: { width: 80, fontSize: 11, textAlign: 'right', fontWeight: 'bold' },
});

export const InvoicePDF = ({ voucher }: { voucher: any }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <Text style={styles.header}>INVOICE</Text>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 }}>
                <View>
                    <Text style={styles.subHeader}>Invoice #: {voucher.voucher_no}</Text>
                    <Text style={styles.subHeader}>Date: {voucher.date ? new Date(voucher.date).toLocaleDateString() : '-'}</Text>
                    <Text style={styles.subHeader}>Status: {voucher.status || 'UNPAID'}</Text>
                </View>
                <View>
                    <Text style={styles.subHeader}>Customer: {voucher.customer?.name || ('ID: ' + voucher.customerId)}</Text>
                    {voucher.customer?.email && <Text style={styles.subHeader}>Email: {voucher.customer.email}</Text>}
                    {voucher.customer?.phone && <Text style={styles.subHeader}>Phone: {voucher.customer.phone}</Text>}
                </View>
            </View>

            <View style={styles.tableContainer}>
                <View style={styles.headerRow}>
                    <Text style={[styles.cellLeft, { paddingLeft: 8 }]}>Item</Text>
                    <Text style={styles.cell}>Qty</Text>
                    <Text style={styles.cell}>Price</Text>
                    <Text style={[styles.cell, { paddingRight: 8 }]}>Total</Text>
                </View>
                {voucher.items.map((item: any, i: number) => (
                    <View key={i} style={styles.row}>
                        <Text style={[styles.cellLeft, { paddingLeft: 8 }]}>{item.name}</Text>
                        <Text style={styles.cell}>{item.quantity}</Text>
                        <Text style={styles.cell}>${Number(item.price).toFixed(2)}</Text>
                        <Text style={[styles.cell, { paddingRight: 8 }]}>${Number(item.total).toFixed(2)}</Text>
                    </View>
                ))}
            </View>

            <View style={styles.totalSection}>
                <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>Subtotal:</Text>
                    <Text style={styles.totalValue}>${Number(voucher.total).toFixed(2)}</Text>
                </View>
                <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>Paid Amount:</Text>
                    <Text style={styles.totalValue}>${Number(voucher.paidAmount || 0).toFixed(2)}</Text>
                </View>
                <View style={styles.totalRow}>
                    <Text style={[styles.totalLabel, { fontWeight: 'bold', fontSize: 14 }]}>Balance:</Text>
                    <Text style={[styles.totalValue, { fontWeight: 'bold', fontSize: 14 }]}>
                        ${Number(voucher.total - (voucher.paidAmount || 0)).toFixed(2)}
                    </Text>
                </View>
            </View>

            <Text style={{ position: 'absolute', bottom: 30, left: 30, right: 30, fontSize: 10, textAlign: 'center', color: '#999' }}>
                Thank you for your business!
            </Text>
        </Page>
    </Document>
);
