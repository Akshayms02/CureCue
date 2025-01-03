import UserManagement from "../../Components/AdminComponents/userManagement";

function AdminUsers({role}) {
  return (
    <>
      <div className="w-[100%] h-full  flex justify-center items-center">
      <UserManagement role={role} />
      </div>
    </>
  );
}

export default AdminUsers;