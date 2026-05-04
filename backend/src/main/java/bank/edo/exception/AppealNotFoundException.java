package bank.edo.exception;
public class AppealNotFoundException extends RuntimeException {
    public AppealNotFoundException(String id) { super("Обращение не найдено: " + id); }
}