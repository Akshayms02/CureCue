import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { Input } from "../../../components/ui/input"
import { Button } from "../../../components/ui/button"
import { ScrollArea } from "../../../components/ui/scroll-area"
import { Separator } from "../../../components/ui/separator"
import { PlusCircle, MinusCircle } from "lucide-react"

interface WalletHistoryItem {
  description: string
  amount: string
}

const DoctorWallet: React.FC = () => {
  const [walletHistory, setWalletHistory] = useState<WalletHistoryItem[]>([
    { description: "Received Rs. 100.00", amount: "+ Rs. 100.00" },
    { description: "Sent Rs. 50.00", amount: "- Rs. 50.00" },
    { description: "Received Rs. 200.00", amount: "+ Rs. 200.00" },
    { description: "Sent Rs. 30.00", amount: "- Rs. 30.00" },
    { description: "Received Rs. 150.00", amount: "+ Rs. 150.00" },
    { description: "Sent Rs. 20.00", amount: "- Rs. 20.00" },
  ])

  const [newTransaction, setNewTransaction] = useState({ amount: '' })

  const handleAddTransaction = () => {
    if (newTransaction.amount) {
      const amount = parseFloat(newTransaction.amount)
      if (!isNaN(amount)) {
        const newItem: WalletHistoryItem = {
          description: `${amount >= 0 ? 'Received' : 'Sent'} Rs. ${Math.abs(amount).toFixed(2)}`,
          amount: `${amount >= 0 ? '+' : '-'} Rs. ${Math.abs(amount).toFixed(2)}`,
        }
        setWalletHistory([newItem, ...walletHistory])
        setNewTransaction({ amount: '' })
      }
    }
  }

  const calculateBalance = () => {
    return walletHistory.reduce((total, item) => {
      const amount = parseFloat(item.amount.replace(/[^\d.-]/g, ''))
      return total + amount
    }, 0)
  }

  return (
    <div className="container mx-auto my-auto p-4 space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Wallet Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-primary">
              Rs. {calculateBalance().toFixed(2)}
            </p>
            <div className="mt-6 space-y-2">
              <Input
                type="number"
                placeholder="Enter the amount"
                value={newTransaction.amount}
                onChange={(e) => setNewTransaction({ amount: e.target.value })}
              />
              <Button onClick={handleAddTransaction} className="w-full">
                Withdraw
              </Button>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Wallet History</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px] pr-4">
              {walletHistory.map((item, index) => (
                <React.Fragment key={index}>
                  <div className="flex justify-between items-center py-2">
                    <div className="flex items-center space-x-2">
                      {item.amount.startsWith('+') ? (
                        <PlusCircle className="text-green-500" />
                      ) : (
                        <MinusCircle className="text-red-500" />
                      )}
                      <p>{item.description}</p>
                    </div>
                    <p
                      className={
                        item.amount.startsWith('-')
                          ? "text-red-500 font-semibold"
                          : "text-green-500 font-semibold"
                      }
                    >
                      {item.amount}
                    </p>
                  </div>
                  {index < walletHistory.length - 1 && <Separator />}
                </React.Fragment>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default DoctorWallet