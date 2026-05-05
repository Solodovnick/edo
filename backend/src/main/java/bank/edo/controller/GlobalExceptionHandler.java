package bank.edo.controller;
import bank.edo.dto.ErrorResponse;
import bank.edo.exception.*;
import org.springframework.http.HttpStatus;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import java.util.stream.Collectors;
@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(AppealNotFoundException.class) @ResponseStatus(HttpStatus.NOT_FOUND)
    public ErrorResponse notFound(AppealNotFoundException ex) { return ErrorResponse.of(404,"Not Found",ex.getMessage()); }
    @ExceptionHandler(InvalidStatusTransitionException.class) @ResponseStatus(HttpStatus.UNPROCESSABLE_ENTITY)
    public ErrorResponse badTransition(InvalidStatusTransitionException ex) { return ErrorResponse.of(422,"Invalid Transition",ex.getMessage()); }
    @ExceptionHandler(MethodArgumentNotValidException.class) @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse validation(MethodArgumentNotValidException ex) {
        String msg = ex.getBindingResult().getFieldErrors().stream().map(FieldError::getDefaultMessage).collect(Collectors.joining("; "));
        return ErrorResponse.of(400,"Validation Error",msg);
    }
    @ExceptionHandler(MethodArgumentTypeMismatchException.class) @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse typeMismatch(MethodArgumentTypeMismatchException ex) {
        return ErrorResponse.of(400,"Bad Request","Некорректный формат параметра '" + ex.getName() + "': " + ex.getValue());
    }
    @ExceptionHandler(IllegalArgumentException.class) @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse illegalArg(IllegalArgumentException ex) { return ErrorResponse.of(400,"Bad Request",ex.getMessage()); }
    @ExceptionHandler(Exception.class) @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ErrorResponse generic(Exception ex) { return ErrorResponse.of(500,"Internal Error",ex.getMessage()); }
}