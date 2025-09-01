import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import api from "@/Services/api/api";

type Course = {
  id: number;
  name: string;
  fee: number;
};

type Payment = {
  _id: string;
  orderId: string;
  paymentId?: string;
  amount: number;
  status: string;
  createdAt: string;
};

type RazorpayResponse = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

const courses: Course[] = [
  { id: 1, name: "Class 1", fee: 1 },
  { id: 2, name: "Class 2", fee: 1 },
  { id: 3, name: "Class 3", fee: 1 },
  { id: 4, name: "Class 4", fee: 1 },
  { id: 5, name: "Class 5", fee: 1 },
  { id: 6, name: "Class 6", fee: 1 },
  { id: 7, name: "Class 7", fee: 1 },
  { id: 8, name: "Class 8", fee: 1 },
  { id: 9, name: "Class 9", fee: 1 },
  { id: 10, name: "Class 10", fee: 1 },
];

export default function RazorpayPayment() {
  const [amount, setAmount] = useState<string>("");
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [successDialog, setSuccessDialog] = useState(false);
  const [failureDialog, setFailureDialog] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<Partial<Payment> | null>(null);

  const fetchPayments = async () => {
    try {
      const { data } = await api.get<{ payments: Payment[] }>("/payments/history");
      setPayments(data.payments || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleCourseChange = (value: number) => {
    setSelectedCourse(value);
    const course = courses.find((c) => c.id === value);
    if (course) setAmount(course.fee.toString());
  };

  const handlePayment = async () => {
    if (!selectedCourse || !amount) return;

    try {
      const { data } = await api.post("/payments/create-order", { amount });
      const { order } = data;

      const options: any = {
        key: "rzp_live_R9XuwBFRtEokgL",
        amount: order.amount,
        currency: order.currency,
        name: "Student Payments",
        description: `Payment for ${courses.find((c) => c.id === selectedCourse)?.name}`,
        order_id: order.id,
        handler: async (response: RazorpayResponse) => {
          try {
            const verifyRes = await api.post("/payments/verify-payment", response);
            if (verifyRes.data.success) {
              setPaymentDetails({
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                amount: Number(amount),
              });
              setSuccessDialog(true);
              fetchPayments();
            } else {
              setFailureDialog(true);
            }
          } catch {
            setFailureDialog(true);
          }
        },
        prefill: { name: "John Doe", email: "john@example.com", contact: "9999999999" },
        theme: { color: "#1e88e5" },
        modal: {
          ondismiss: () => setFailureDialog(true),
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      setFailureDialog(true);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="p-6 max-w-5xl mx-auto"
    >
      <Card className="mb-6">
        <CardHeader>
          <h2 className="text-2xl font-bold text-center text-blue-900">
            Checking Payments (₹1 transfer test)
          </h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <Label htmlFor="course-select">Select Course</Label>
              <Select value={selectedCourse ?? ""} onValueChange={handleCourseChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a course" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.name} - ₹{course.fee}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="amount-input">Amount</Label>
              <Input
                id="amount-input"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            <Button
              className="h-14 mt-2 md:mt-0"
              onClick={handlePayment}
              disabled={!selectedCourse}
            >
              Pay Now
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h3 className="text-xl font-semibold">Payment History</h3>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Payment ID</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.length ? (
                payments.map((p) => (
                  <TableRow key={p._id}>
                    <TableCell>{p.orderId}</TableCell>
                    <TableCell>{p.paymentId ?? "-"}</TableCell>
                    <TableCell>
                      {new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(p.amount / 100)}
                    </TableCell>
                    <TableCell
                      className={`font-bold ${
                        p.status === "paid" ? "text-green-600" : p.status === "failed" ? "text-red-600" : "text-orange-600"
                      }`}
                    >
                      {p.status === "CREATED" ? "Failed" : p.status}
                    </TableCell>
                    <TableCell>{new Date(p.createdAt).toLocaleString()}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    No payment history found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Success Dialog */}
      <Dialog open={successDialog} onOpenChange={setSuccessDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-green-600">Payment Successful 🎉</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <p><b>Order ID:</b> {paymentDetails?.orderId}</p>
            <p><b>Payment ID:</b> {paymentDetails?.paymentId}</p>
            <p><b>Amount:</b> ₹{paymentDetails?.amount}</p>
          </div>
          <DialogFooter>
            <Button onClick={() => setSuccessDialog(false)} variant="default">
              OK
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Failure Dialog */}
      <Dialog open={failureDialog} onOpenChange={setFailureDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-600">Payment Failed ❌</DialogTitle>
          </DialogHeader>
          <p>Something went wrong or you cancelled the payment.</p>
          <DialogFooter>
            <Button onClick={() => setFailureDialog(false)} variant="destructive">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
