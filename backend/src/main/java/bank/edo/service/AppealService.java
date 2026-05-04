package bank.edo.service;
import bank.edo.dto.*;
import bank.edo.entity.Appeal;
import bank.edo.exception.*;
import bank.edo.repository.AppealRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import java.time.LocalDate;
import java.util.*;
@Service @RequiredArgsConstructor
public class AppealService {
    private final AppealRepository repo;
    private static final Map<String,Set<String>> TRANSITIONS = Map.ofEntries(
        Map.entry("Черновик", Set.of("Зарегистрировано")),
        Map.entry("Зарегистрировано", Set.of("Назначено","На ПК")),
        Map.entry("На ПК", Set.of("Назначено","Отказано")),
        Map.entry("Назначено", Set.of("На ответственном, взято")),
        Map.entry("На ответственном, взято", Set.of("Запрос в БП","Готово к подписи","Решено","Отказано")),
        Map.entry("Запрос в БП", Set.of("На ответственном, взято")),
        Map.entry("Готово к подписи", Set.of("На ответственном, взято","Решено")),
        Map.entry("Решено", Set.of("Аудит","Закрыто")),
        Map.entry("Аудит", Set.of("На аудите")),
        Map.entry("На аудите", Set.of("Решено","Пройден аудит","Отказано")),
        Map.entry("Пройден аудит", Set.of("Закрыто")),
        Map.entry("Закрыто", Set.of("В архиве")),
        Map.entry("Отказано", Set.of())
    );
    @Transactional(readOnly=true)
    public Page<AppealListItemDto> getAll(int page, int size, String search, String status, String category) {
        var pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC,"regDate"));
        Page<Appeal> appeals;
        boolean hasSearch = StringUtils.hasText(search);
        boolean hasCategory = StringUtils.hasText(category);
        boolean hasStatus = StringUtils.hasText(status);
        if (hasCategory && hasSearch) {
            appeals = repo.findByCategoryAndSearch(category, search, pageable);
        } else if (hasCategory) {
            appeals = repo.findByApplicantCategoryIgnoreCase(category, pageable);
        } else if (hasSearch) {
            appeals = repo.findByApplicantNameContainingIgnoreCaseOrOrganizationNameContainingIgnoreCaseOrNumberContainingIgnoreCase(search, search, search, pageable);
        } else if (hasStatus) {
            appeals = repo.findByStatusIgnoreCase(status, pageable);
        } else {
            appeals = repo.findAll(pageable);
        }
        return appeals.map(AppealListItemDto::from);
    }
    @Transactional(readOnly=true)
    public AppealDto getById(UUID id) { return AppealDto.from(findOrThrow(id)); }
    @Transactional
    public AppealDto create(AppealCreateRequest req) {
        var a = Appeal.builder().number(genNumber()).regDate(LocalDate.now()).deadline(req.getDeadline())
            .appealType(req.getAppealType()).status("Зарегистрировано").applicantCategory(req.getApplicantCategory())
            .applicantName(req.getApplicantName()).organizationName(req.getOrganizationName())
            .address(req.getAddress()).phone(req.getPhone()).email(req.getEmail()).cbs(req.getCbs())
            .appealCategory(req.getAppealCategory()).appealSubcategory(req.getAppealSubcategory())
            .content(req.getContent()).responsible(req.getResponsible()).registrar(req.getRegistrar())
            .createdBy(req.getCreatedBy()).priority(req.getPriority()!=null?req.getPriority():"Средний").build();
        return AppealDto.from(repo.save(a));
    }
    @Transactional
    public AppealDto update(UUID id, AppealUpdateRequest req) {
        var a = findOrThrow(id);
        if (StringUtils.hasText(req.getStatus())) { validateTransition(a.getStatus(),req.getStatus()); a.setStatus(req.getStatus()); }
        if (req.getSolution()!=null) a.setSolution(req.getSolution());
        if (req.getResponse()!=null) a.setResponse(req.getResponse());
        if (req.getResponsible()!=null) a.setResponsible(req.getResponsible());
        if (req.getPriority()!=null) a.setPriority(req.getPriority());
        if (req.getRequiresAttention()!=null) a.setRequiresAttention(req.getRequiresAttention());
        if (req.getRequiresSignature()!=null) a.setRequiresSignature(req.getRequiresSignature());
        if (req.getAuditStatus()!=null) a.setAuditStatus(req.getAuditStatus());
        return AppealDto.from(repo.save(a));
    }
    private Appeal findOrThrow(UUID id) { return repo.findById(id).orElseThrow(()->new AppealNotFoundException(id.toString())); }
    private void validateTransition(String from, String to) {
        if (!TRANSITIONS.getOrDefault(from,Set.of()).contains(to)) throw new InvalidStatusTransitionException(from,to);
    }
    private String genNumber() {
        String n = String.valueOf(350000+(System.currentTimeMillis()%9999));
        return repo.existsByNumber(n) ? n+"X" : n;
    }
}