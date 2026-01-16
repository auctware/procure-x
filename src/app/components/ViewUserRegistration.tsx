import { Home, ChevronRight, Users } from 'lucide-react';
import { useState } from 'react';

interface UserRow {
  id: string;
  userId: string;
  name: string;
  mobileNo: string;
  emailId: string;
  role: string;
  orgName: string;
  status: 'Active' | 'Pending' | 'Inactive';
}

export default function ViewUserRegistration() {
  const [users] = useState<UserRow[]>([
    {
      id: '1',
      userId: 'USR001',
      name: 'User One',
      mobileNo: '9000000001',
      emailId: 'user1@dummy.com',
      role: 'Org Admin',
      orgName: 'Sample Farmers Co-op One',
      status: 'Active',
    },
    {
      id: '2',
      userId: 'USR002',
      name: 'User Two',
      mobileNo: '9000000002',
      emailId: 'user2@dummy.com',
      role: 'Operator',
      orgName: 'Sample Women SHG One',
      status: 'Pending',
    },
  ]);

  return (
    <div className="p-8" style={{ backgroundColor: '#FFFFFF', minHeight: '100vh' }}>
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2" style={{ fontSize: '14px', color: '#666' }}>
        <Home className="w-4 h-4" style={{ color: '#027F83' }} />
        <button
          className="hover:underline transition-colors cursor-pointer"
          style={{ color: '#027F83', fontWeight: '500', background: 'none', border: 'none', padding: 0 }}
        >
          Home
        </button>
        <ChevronRight className="w-4 h-4" />
        <span style={{ fontWeight: '600', color: '#222' }}>View User Registration</span>
      </div>

      <div
        className="rounded-2xl border overflow-hidden"
        style={{ backgroundColor: '#FFFFFF', borderColor: '#E5EBEF' }}
      >
        <div
          className="px-6 py-5 border-b flex items-center gap-3"
          style={{ borderColor: '#E5EBEF' }}
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: '#E6F7F7' }}
          >
            <Users className="w-5 h-5" style={{ color: '#027F83' }} />
          </div>
          <div>
            <h2
              style={{
                fontSize: '18px',
                fontWeight: '700',
                color: '#777777',
              }}
            >
              View User Registration
            </h2>
            <p style={{ fontSize: '13px', color: '#666', marginTop: '2px' }}>
              Browse all registered users with their roles and organizations.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead style={{ backgroundColor: '#F7F9FA' }}>
              <tr>
                <th className="px-6 py-4 text-left" style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  User ID
                </th>
                <th className="px-6 py-4 text-left" style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Name
                </th>
                <th className="px-6 py-4 text-left" style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Mobile / Email
                </th>
                <th className="px-6 py-4 text-left" style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Role
                </th>
                <th className="px-6 py-4 text-left" style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Organization
                </th>
                <th className="px-6 py-4 text-left" style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="border-t transition-colors hover:bg-gray-50"
                  style={{ borderColor: '#E5EBEF' }}
                >
                  <td className="px-6 py-4" style={{ fontSize: '14px', color: '#315B78' }}>
                    {user.userId}
                  </td>
                  <td className="px-6 py-4" style={{ fontSize: '14px', color: '#315B78' }}>
                    {user.name}
                  </td>
                  <td className="px-6 py-4" style={{ fontSize: '14px', color: '#315B78' }}>
                    <div>{user.mobileNo}</div>
                    <div style={{ fontSize: '12px', color: '#777777' }}>{user.emailId}</div>
                  </td>
                  <td className="px-6 py-4" style={{ fontSize: '14px', color: '#315B78' }}>
                    {user.role}
                  </td>
                  <td className="px-6 py-4" style={{ fontSize: '14px', color: '#315B78', maxWidth: '260px' }}>
                    {user.orgName}
                  </td>
                  <td className="px-6 py-4" style={{ fontSize: '14px', color: '#315B78' }}>
                    {user.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


