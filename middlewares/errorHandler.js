function errorHandler(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
  
    res.status(err.status || 500);
    res.send({"error":true,"message": err.message})
  }
// catch 404 and forward to error handler
//  app.use(function(req, res, next) {
//    next(createError(404));
//  });


/*
// error handler
app.use();
*/