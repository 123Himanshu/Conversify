import UserBox from "./UserBox";

interface UsersListProps {
  users: any;
}

const UsersList: React.FC<UsersListProps> = ({ users }) => {
  return (
    <aside className="fixed inset-y-0 pb-20 lg:pb-0 lg:left-20 lg:w-80 lg:block overflow-y-auto border-r border-gray-200 block w-full left-0 dark:bg-primary dark:border-gray-800">
      <div className="px-5">
        <div className="flex-col">
          <div className="text-2xl font-bold text-neutral-800 dark:text-slate-100 py-4">
            People
          </div>
        </div>
        {users.map((user: any, index: number) => (
          <UserBox key={index} user={user} />
        ))}
      </div>
    </aside>
  );
};

export default UsersList;
