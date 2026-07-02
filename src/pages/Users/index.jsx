import { useEffect, useState } from "react";
import { Users as UsersIcon, UserPlus } from "lucide-react";
import toast from "react-hot-toast";
import StatCard from "../../components/cards/StatCard";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import UserTable from "../../components/tables/UserTable";
import { listUsers, deleteUser } from "../../services/users";
import { Link } from "react-router-dom";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const data = await listUsers();
      setUsers(data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteUser(id);
      toast.success("User deleted successfully");
      fetchUsers();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const stats = [
    { title: "Total Users", value: String(users.length) },
    { title: "Administrators", value: String(users.filter(u => u.role === "ADMIN").length) },
    { title: "Managers", value: String(users.filter(u => u.role === "MANAGER").length) },
    { title: "Staff Members", value: String(users.filter(u => u.role === "STAFF").length) },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} title={stat.title} value={stat.value} />
        ))}
      </div>

      <Card className="p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
             <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <UsersIcon size={20} />
             </div>
             <div>
                <h2 className="text-lg font-semibold text-text-main">User Management</h2>
                <p className="text-xs text-text-muted">Manage system access and roles</p>
             </div>
          </div>
          <Link to="/register">
            <Button>
              <UserPlus size={16} />
              Register New User
            </Button>
          </Link>
        </div>

        <div className="mt-5">
          {isLoading && <p className="text-sm text-text-muted">Loading users...</p>}
          {!isLoading && users.length === 0 && <p className="py-8 text-center text-sm text-text-muted">No users found.</p>}
          {!isLoading && users.length > 0 && (
            <UserTable data={users} onDelete={handleDelete} />
          )}
        </div>
      </Card>
    </div>
  );
};

export default Users;
