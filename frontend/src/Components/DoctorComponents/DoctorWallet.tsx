import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import Swal from 'sweetalert2'
import { RootState } from '../../Redux/store'

import { Button } from "../../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../../components/ui/dialog"
import { Input } from "../../../components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table"
import { ArrowLeft, ArrowRight, CreditCard, DollarSign } from 'lucide-react'
import { getWalletData, withDrawMoney } from '../../services/doctorServices'

interface Transaction {
  transactionId: string
  amount: number
  date: string
  transactionType: 'credit' | 'debit'
}

export default function DoctorWallet() {
  const DoctorData = useSelector((state: RootState) => state.doctor)
  const [status, setStatus] = useState('All')
  const [allTransactions, setTransactions] = useState<Transaction[]>([])
  const [balance, setBalance] = useState<number>(0)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const fetchWalletData = async (status: string, page: number) => {
    try {
      const doctorId = DoctorData?.doctorInfo?.doctorId
      if (doctorId) {
        const response = await getWalletData(doctorId as string, status as string, page as number)
        const convertedData = response?.data.response.transactions.map((walletData: any) => ({
          transactionId: walletData.transactionId,
          amount: walletData.amount,
          date: new Date(walletData.date).toISOString().split('T')[0],
          transactionType: walletData.transactionType,
        }))
        setBalance(response?.data.response.balance)
        setTransactions(convertedData)
        setTotalPages(response?.data.response.totalPages)
      }
    } catch (error) {
      console.error('Error fetching wallet data:', error)
    }
  }

  useEffect(() => {
    fetchWalletData(status, currentPage)
  }, [DoctorData, status, currentPage])

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus)
    setCurrentPage(1)
  }

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen)
    formik.resetForm()
  }

  const formik = useFormik({
    initialValues: {
      withdrawAmount: '',
    },
    validationSchema: Yup.object({
      withdrawAmount: Yup.number()
        .required('Amount is required')
        .min(100, 'Amount must be at least 100')
        .max(balance, `Amount cannot exceed ${balance}`)
        .typeError('Enter a valid Amount'),
    }),
    onSubmit: (values) => {
      Swal.fire({
        title: 'Confirm Withdrawal',
        text: `Are you sure you want to withdraw $${values.withdrawAmount}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, withdraw it!',
        cancelButtonText: 'No, cancel!',
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const doctorId = DoctorData?.doctorInfo?.doctorId
            const response = await withDrawMoney(doctorId as string, values.withdrawAmount as string)
            console.log(response)
            if (response?.status === 200) {
              const convertedData = response?.data.response.transactions.map((walletData: any) => ({
                transactionId: walletData.transactionId,
                amount: walletData.amount,
                date: new Date(walletData.date).toISOString().split('T')[0],
                transactionType: walletData.transactionType,
              }))
              setBalance(response?.data.response.balance)
              setTransactions(convertedData)
              Swal.fire({
                title: 'Success!',
                text: `You have successfully withdrawn $${values.withdrawAmount}`,
                icon: 'success',
                confirmButtonText: 'OK',
              }).then(() => {
                toggleModal()
              })
            } else {
              Swal.fire({
                title: 'Error!',
                text: 'There was a problem with your withdrawal. Please try again.',
                icon: 'error',
                confirmButtonText: 'OK',
              })
            }
          } catch (error) {
            Swal.fire({
              title: 'Error!',
              text: 'There was a problem processing your withdrawal. Please try again later.',
              icon: 'error',
              confirmButtonText: 'OK',
            })
            console.error('Error during withdrawal:', error)
          }
        }
      })
    },
  })

  const handlePagination = (direction: string) => {
    if (direction === "next" && currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    } else if (direction === "previous" && currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Wallet</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <DollarSign className="h-8 w-8 text-green-500" />
            <div>
              <p className="text-sm text-muted-foreground">Available Balance</p>
              <p className="text-3xl font-bold">Rs {balance.toFixed(2)}</p>
            </div>
          </div>
          {balance >= 100 && (
            <Button onClick={toggleModal}>
              <CreditCard className="mr-2 h-4 w-4" /> Withdraw
            </Button>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <div className="flex space-x-2">
            <Button
              variant={status === 'All' ? "default" : "outline"}
              onClick={() => handleStatusChange('All')}
            >
              All
            </Button>
            <Button
              variant={status === 'credit' ? "default" : "outline"}
              onClick={() => handleStatusChange('credit')}
            >
              Credit
            </Button>
            <Button
              variant={status === 'debit' ? "default" : "outline"}
              onClick={() => handleStatusChange('debit')}
            >
              Debit
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Transaction Type</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allTransactions.map((transaction) => (
                <TableRow key={transaction.transactionId}>
                  <TableCell>{transaction.transactionId}</TableCell>
                  <TableCell>Rs.{transaction.amount.toFixed(2)}</TableCell>
                  <TableCell>{transaction.date}</TableCell>
                  <TableCell className={transaction.transactionType === 'credit' ? 'text-green-600' : 'text-red-600'}>
                    {transaction.transactionType}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex items-center justify-between space-x-2 py-4">
            <div className="text-sm text-muted-foreground">
              Showing page {currentPage} of {totalPages}
            </div>
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePagination("previous")}
                disabled={currentPage === 1}
              >
                <ArrowLeft className="h-4 w-4" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePagination("next")}
                disabled={currentPage === totalPages}
              >
                Next
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Withdraw Money</DialogTitle>
          </DialogHeader>
          <form onSubmit={formik.handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="withdrawAmount" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Amount to Withdraw
                </label>
                <Input
                  type="number"
                  id="withdrawAmount"
                  placeholder="Enter amount"
                  {...formik.getFieldProps('withdrawAmount')}
                />
                {formik.touched.withdrawAmount && formik.errors.withdrawAmount && (
                  <p className="text-sm text-red-500">{formik.errors.withdrawAmount}</p>
                )}
              </div>
            </div>
            <DialogFooter className="mt-4">
              <Button type="button" variant="outline" onClick={toggleModal}>
                Cancel
              </Button>
              <Button type="submit">Withdraw</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}