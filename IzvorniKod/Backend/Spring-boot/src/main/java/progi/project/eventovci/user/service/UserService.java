package progi.project.eventovci.user.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import progi.project.eventovci.event.entity.Event;
import progi.project.eventovci.link.entity.SocialMediaLink;
import progi.project.eventovci.link.repository.LinkRepository;
import progi.project.eventovci.media.content.entity.MediaContent;
import progi.project.eventovci.event.controller.dto.EventData;
import progi.project.eventovci.user.entity.User;
import progi.project.eventovci.user.controller.dto.DataForm;
import progi.project.eventovci.user.entity.UserNotFoundException;
import progi.project.eventovci.user.entity.UserAlreadyExistsException;
import progi.project.eventovci.media.content.entity.repository.MediaContentRepository;
import progi.project.eventovci.user.repository.UserRepository;
import progi.project.eventovci.event.repository.EventRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private MediaContentRepository mediaContentRepository;

    @Autowired
    private LinkRepository linkRepository;

    public User login(String email, String password) {
        User user = userRepository.findUserByEmail(email);
        if (user != null && Objects.equals(user.getPassword(), password)) {
            return user;
        } else {
            throw new UserNotFoundException("Incorrect email or password!");
        }

    }

    public User register(String username, String email, String password, String typeOfUser, String homeAdress, Boolean shouldPayMembership) {
        User user = userRepository.findUserByEmail(email);
        if(user != null && Objects.equals(user.getEmail(), email)){
            throw new UserAlreadyExistsException("Neispravan email!");
        }
        user = userRepository.findUserByUsername(username);
        if(user != null && Objects.equals(user.getUsername(), username)) {
            throw new UserAlreadyExistsException("Neispravno korisničko ime!");
        }
        user = new User(username, email, password, typeOfUser, homeAdress, shouldPayMembership);
        userRepository.save(user);
        return user;
    }

    public DataForm data(Long id){
        User user = userRepository.findUserById(id);
        if(user != null){

            if(Objects.equals(user.getTypeOfUser(),"posjetitelj")){
                return new DataForm(user.getUsername(), user.getEmail(), user.getTypeOfUser(), user.getHomeAdress(), user.getShouldPayMembership(), null, null);
            }
            if(Objects.equals(user.getTypeOfUser(),"organizator")){
                List<Event> event = eventRepository.findAllByEventCoordinatorid(id);
                List<EventData> eventlist = new ArrayList<>();
                for (Event e : event) {
                    MediaContent media = mediaContentRepository.first(e.getId()).get(0);
                    EventData eventData = new EventData(e.getEventName(), e.getLocation(),e.getTimeOfTheEvent(), media.getContent());
                    eventlist.add(eventData);
                }

                List<SocialMediaLink> socialMediaLinks = linkRepository.findAllByEventCoordinatorId(id);
                List<String> links = new ArrayList<>();
                for (SocialMediaLink s : socialMediaLinks) {
                    links.add(s.getLink());
                }

                return new DataForm(user.getUsername(), user.getEmail(), user.getTypeOfUser(), user.getHomeAdress(), user.getShouldPayMembership(), eventlist, links);

            }
            return null;
        }else {
            throw new UserNotFoundException("Korisnik ne postoji!");
}
}

}
