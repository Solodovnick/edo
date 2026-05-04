package bank.edo.exception;
public class InvalidStatusTransitionException extends RuntimeException {
    public InvalidStatusTransitionException(String from, String to) {
        super("Недопустимый переход: «" + from + "» → «" + to + "»");
    }
}