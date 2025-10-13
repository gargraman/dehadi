import RoleSelector from '../RoleSelector';

export default function RoleSelectorExample() {
  return (
    <RoleSelector onRoleSelect={(roleId) => console.log('Role selected:', roleId)} />
  );
}
