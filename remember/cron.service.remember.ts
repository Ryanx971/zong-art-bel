this.nativeStorage
  .getItem(STORAGE_MESSAGE_TIME)
  .then((data: string) => {
    const timeSplit: string[] = data.split(':');
    const hour = timeSplit[0].trim();
    const minute = timeSplit[1].trim();
    messageTime = minute + ' ' + hour + ' * * *';
  })
  .catch((e: any) => {
    console.error('Error in getItem', e);
  })
  .finally(() => {
    // Toutes les jours a 10h30
    this.job = new CronJob(messageTime, this.doCron);
    // Every minute
    // this.job = new CronJob('* * * * *', this.doCron);
    // Every second
    // this.job = new CronJob('* * * * * *', this.doCron);
    this.job.start();
  });
