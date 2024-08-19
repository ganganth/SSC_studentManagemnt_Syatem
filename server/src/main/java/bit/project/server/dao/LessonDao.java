package bit.project.server.dao;

import bit.project.server.entity.Lesson;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(exported=false)
public interface LessonDao extends JpaRepository<Lesson, Integer>{
    @Query("select new Lesson (l.id,l.code) from Lesson l")
    Page<Lesson> findAllBasic(PageRequest pageRequest);

    Lesson findByCode(String code);
}