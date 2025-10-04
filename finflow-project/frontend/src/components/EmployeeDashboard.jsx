// frontend/src/components/EmployeeDashboard.jsx
import { useState } from 'react';
import AddExpenseForm from './AddExpenseForm';
import ExpenseList from './ExpenseList';

function EmployeeDashboard() {
    const [newExpense, setNewExpense] = useState(null);

    return (
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
                <AddExpenseForm onExpenseAdded={setNewExpense} />
            </div>
            <div className="md:col-span-2">
                <ExpenseList newExpense={newExpense} />
            </div>
        </div>
    );
}
export default EmployeeDashboard;