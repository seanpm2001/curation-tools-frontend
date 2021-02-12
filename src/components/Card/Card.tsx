import React from 'react';
import { Link } from 'react-router-dom';
import {
  Card as MuiCard,
  CardMedia,
  Grid,
  Typography,
} from '@material-ui/core';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Button, CardText } from '../';
import { Prospect } from '../../models';

/**
 * Styles for the Card component.
 */
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      margin: 'auto',
      paddingBottom: '0.75rem',
      marginBottom: '2.5rem',
      paddingTop: 0,
      border: 0,
      borderBottom: `1px solid ${theme.palette.grey[400]}`,
    },
    image: {
      borderRadius: 4,
    },
    bottomRightCell: {
      display: 'flex',
    },
    [theme.breakpoints.down('sm')]: {
      bottomRightCell: {
        justifyContent: 'flex-start',
        '& > *': {
          marginRight: '0.625rem',
        },
      },
    },
    [theme.breakpoints.up('md')]: {
      bottomRightCell: {
        justifyContent: 'flex-end',
        '& > *': {
          marginLeft: '0.625rem',
        },
      },
    },
  })
);

interface CardProps {
  /**
   * The Prospect object that holds all the data we need to display.
   */
  prospect: Prospect;

  /**
   * The base URL for action buttons
   */
  url: string;

  /**
   * What type of prospect this card is used to display (used to work out
   * which action buttons need to be shown alongside the prospect info).
   */
  type: 'pending' | 'snoozed' | 'approved' | 'rejected' | 'live' | 'scheduled';
}

/**
 * A custom Card component that shows a thumbnail image of a given article
 * alongside its title, excerpt, various other metadata and action buttons.
 */
export const Card: React.FC<CardProps> = (props) => {
  const classes = useStyles();
  const { prospect, type, url } = props;

  let labelColor: 'default' | 'primary' | 'secondary' = 'primary';

  if (type === 'snoozed') {
    labelColor = 'default';
  } else if (type === 'rejected') {
    labelColor = 'secondary';
  }

  return (
    <MuiCard variant="outlined" square className={classes.root}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <CardMedia
            component="img"
            src={prospect.imageUrl}
            alt={prospect.altText}
            className={classes.image}
          />
        </Grid>
        <Grid item xs={12} sm={8}>
          <CardText
            author={prospect.author ?? ''}
            excerpt={prospect.excerpt ?? ''}
            publisher={prospect.publisher ?? ''}
            title={prospect.title}
            url={prospect.url}
            label={type === 'pending' ? null : type}
            labelColor={labelColor}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography
            variant="caption"
            color="textSecondary"
            component="span"
            align="left"
          >
            {prospect.source} &middot; {prospect.topic || 'Uncategorized'}
          </Typography>
        </Grid>
        <Grid item className={classes.bottomRightCell} xs={12} sm={6}>
          {['pending', 'snoozed', 'approved'].includes(type) && (
            <Button buttonType="negative">Reject</Button>
          )}
          {['pending', 'approved', 'rejected'].includes(type) && (
            <Button buttonType="neutral">Snooze</Button>
          )}
          {['live', 'scheduled'].includes(type) && (
            <Button buttonType="negative">Remove</Button>
          )}
          {['pending', 'snoozed'].includes(type) && (
            <Button
              component={Link}
              to={{
                pathname: `${url}edit-and-approve/`,
                state: { prospect },
              }}
            >
              Edit &amp; Approve
            </Button>
          )}
          {['approved', 'live', 'scheduled'].includes(type) && (
            <Button
              buttonType="neutral"
              component={Link}
              to={{ pathname: `${url}edit/`, state: { prospect } }}
            >
              Edit
            </Button>
          )}
        </Grid>
      </Grid>
    </MuiCard>
  );
};
