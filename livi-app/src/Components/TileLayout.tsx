import React from 'react';
import Tile from '../Components/Tile/Tile';
import { PageContainer, TilesGrid } from '../Pages/styles';

export interface TileItem {
  title: string;
  icon: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  description?: string;
  size?: 'small' | 'medium' | 'large';
}

export interface TilesPageProps {
  title?: string;
  subtitle?: string;
  tiles: TileItem[];
  columns?: number;
  gap?: string;
  className?: string;
}

const TilesPage: React.FC<TilesPageProps> = ({
  title = "Dashboard",
  subtitle = "Choose an option to get started",
  tiles,
  columns = 4,
  gap = "1.5rem",
  className,
}) => {
  return (
    <PageContainer className={className}>
      <div>
        <h2>{title}</h2>
        {subtitle && <p>{subtitle}</p>}
      </div>
      
      <TilesGrid columns={columns} gap={gap}>
        {tiles.map((tile, index) => (
          <Tile
            key={index}
            title={tile.title}
            icon={tile.icon}
            onClick={tile.onClick}
            disabled={tile.disabled}
            description={tile.description}
            size={tile.size}
          />
        ))}
      </TilesGrid>
    </PageContainer>
  );
};

export default TilesPage;