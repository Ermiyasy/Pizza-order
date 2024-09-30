import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

const CustomCard = ({ title, content }) => {
  return (
    <Card style={{ width: '300px', margin: '10px' }}>
      <CardContent>
        <Typography variant="h5" component="div">
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {content}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default CustomCard;
