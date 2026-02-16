import { User, Mail, Database, Home, Camera } from "lucide-react";
import TilesPage, { type TileItem } from "../Components/TileLayout";
import { useNavigate } from "react-router-dom";

export function Profile() {
  const navigate = useNavigate();
  const tiles: TileItem[] = [
    {
      title: "Profile",
      icon: <User />,
      onClick: () => console.log('Profile clicked'),
      description: "Manage your account settings",
    },
    {
      title: "My Properties",
      icon: <Home />,
      onClick: () => navigate("/properties"),
      description: "Manage And Update your Properties",
    },
    {
      title: "Messages",
      icon: <Mail />,
      // onClick: () => makeTestApiCall(),
      description: "Check your inbox and sent items",
      size: 'medium',
    },
    // {
    //   title: "Security",
    //   icon: <Shield />,
    //   onClick: () => console.log('Security clicked'),
    //   description: "Configure security settings",
    // },
    // {
    //   title: "Support",
    //   icon: <HelpCircle />,
    //   onClick: () => console.log('Support clicked'),
    //   description: "Get help and contact support",
    //   disabled: true,
    // },
    // {
    //   title: "Billing",
    //   icon: <CreditCard />,
    //   onClick: () => console.log('Billing clicked'),
    //   description: "Manage payments and invoices",
    //   size: 'large',
    // },
    // {
    //   title: "Storage",
    //   icon: <Database />,
    //   onClick: () => console.log('Storage clicked'),
    //   description: "View storage usage and limits",
    //   size: 'small',
    // },
     {
      title: "Storage",
      icon: <Database />,
      onClick: () => navigate("/properties"),
      description: "View storage usage and limits",
      size: 'small',
    },
    // {
    //   title: "Notifications",
    //   icon: <Bell />,
    //   onClick: () => console.log('Notifications clicked'),
    //   description: "Configure notification preferences",
    // },
    {
      title: "Media",
      icon: <Camera />,
      onClick: () => navigate("/media"),
      description: "Manage photos and videos",
    },
    // {
    //   title: "Settings",
    //   icon: <Settings />,
    //   onClick: () => console.log('Settings clicked'),
    //   description: "System and application settings",
    // },
  ];

  return (
    // <Page>
      <TilesPage
        title="Admin Dashboard"
        subtitle="Manage your application settings and features"
        tiles={tiles}
        columns={4}
        gap="2rem"
      />
    // </Page>
  );
}