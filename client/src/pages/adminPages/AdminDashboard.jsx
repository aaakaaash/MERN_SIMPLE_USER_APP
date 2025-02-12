import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import Swal from "sweetalert2";

const AdminDashboard = () => {
  const [data, setData] = useState([]); 
  const [filteredData, setFilteredData] = useState([]); 
  const [searchQuery, setSearchQuery] = useState(""); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin`);
      if (!response.ok) throw new Error("Failed to fetch users");
      const result = await response.json();
      setData(result);
      setFilteredData(result); 
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBlockToggle = async (userId, isBlocked) => {
    try {
      const response = await fetch(`/api/admin/block/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isBlocked: !isBlocked }),
      });

      if (!response.ok) throw new Error("Failed to update status");

      toast.success(isBlocked ? "User unblocked" : "User blocked");
      fetchUsers();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDelete = async (userId) => {
    Swal.fire({
        title: "Are you sure?",
        text: "This action cannot be undone!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "Cancel"
    }).then(async (result) => {
        if (!result.isConfirmed) return;

        try {
            const response = await fetch(`/api/admin/delete/${userId}`, { method: "DELETE" });
            if (!response.ok) throw new Error("Failed to delete user");

            Swal.fire("Deleted!", "User has been deleted.", "success");
            fetchUsers();
        } catch (error) {
            Swal.fire("Error!", error.message, "error");
        }
    });
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    if (query === "") {
      setFilteredData(data);
    } else {
      const filtered = data.filter(user => 
        user.username.toLowerCase().includes(query) || 
        user.email.toLowerCase().includes(query)
      );
      setFilteredData(filtered);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-screen bg-gray-100 p-6">
      <Toaster position="top-right" />
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <input
        type="text"
        placeholder="Search by username or email..."
        value={searchQuery}
        onChange={handleSearch}
        className="mb-4 p-3 w-full max-w-lg border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
      />

      {loading && <p className="text-blue-600">Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}

      <div className="overflow-x-auto w-full max-w-4xl">
        <table className="w-full border-collapse bg-white shadow-lg rounded-lg">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="py-3 px-4">No</th>
              <th className="py-3 px-4">Username</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-4">No users found</td>
              </tr>
            ) : (
              filteredData.map((user, index) => (
                <tr key={user._id} className="border-b text-center">
                  <td className="py-3 px-4">{index + 1}</td>
                  <td className="py-3 px-4">{user.username}</td>
                  <td className="py-3 px-4">{user.email}</td>
                  <td className={`py-3 px-4 font-semibold ${user.isBlocked ? "text-red-600" : "text-green-600"}`}>
                    {user.isBlocked ? "Blocked" : "Active"}
                  </td>
                  <td className="py-3 px-4 space-x-2">
                    <button
                      className={`px-4 py-2 text-white font-medium rounded-md transition ${
                        user.isBlocked ? "bg-green-500 hover:bg-green-600" : "bg-orange-500 hover:bg-orange-600"
                      }`}
                      onClick={() => handleBlockToggle(user._id, user.isBlocked)}
                    >
                      {user.isBlocked ? "Unblock" : "Block"}
                    </button>
                    <button
                      className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-md transition"
                      onClick={() => handleDelete(user._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
