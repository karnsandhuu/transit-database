router.post(
    '/passengers/:passengerId/passes',
    controller.purchasePass
);

router.post(
    '/passes/:ticketId/top-up',
    controller.topUpTimedPass
);

router.get(
    '/passengers/:passengerId/passes',
    controller.getPassengerPasses
);