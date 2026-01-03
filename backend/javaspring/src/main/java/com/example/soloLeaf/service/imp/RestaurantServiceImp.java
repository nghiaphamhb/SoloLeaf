package com.example.soloLeaf.service.imp;

import com.example.soloLeaf.dto.RestaurantDTO;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface RestaurantServiceImp{
    boolean insertRestaurant(MultipartFile file,
                             String title,
                             String subtitle,
                             String description,
//                             String image, // day chi la ten cua file da upload nen 0 can nhap
                             boolean isFreeShip,
                             String address,
                             String openDate);

    List<RestaurantDTO> getHomePageRestaurants();
    RestaurantDTO getDetailRestaurant(int id);
    List<RestaurantDTO> getRestaurantTabs(String q, int limit);

}
