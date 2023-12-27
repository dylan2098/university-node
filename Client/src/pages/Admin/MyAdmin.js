import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import CategoryManage from './CategoryManage';
import UserManage from './UserManage';
import Pages from '../Index'

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
    height: "77vh",
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
    height: '100%',
  },
}));

export default function MyAdmin() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        aria-label="Menu manage"
        className={classes.tabs}
      >
        <Tab label="Category" {...a11yProps(0)} />
        <Tab label="Users" {...a11yProps(1)} />
        <Tab label="Course" {...a11yProps(2)} />
      </Tabs>
      <Container fixed style={{ maxHeight: '100%', overflow: 'auto' }}>
        <TabPanel value={value} index={0}>
          <CategoryManage />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <UserManage />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <Pages.CourseManage />
        </TabPanel>
      </Container>
    </div>
  );
}