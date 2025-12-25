package com.example.soloLeaf.service;

import com.example.soloLeaf.dto.PromoDTO;
import com.example.soloLeaf.dto.UserDTO;
import com.example.soloLeaf.entity.Promo;
import com.example.soloLeaf.entity.Users;
import com.example.soloLeaf.repository.PromoRepository;
import com.example.soloLeaf.service.imp.PromoServiceImp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class PromoService implements PromoServiceImp {
    @Autowired
    PromoRepository promoRepository;

    @Override
    public List<PromoDTO> getAllPromo() {
        List<Promo> list = promoRepository.findAll();
        List<PromoDTO> listDTO = new ArrayList<PromoDTO>();

        for (Promo promo : list) {
            PromoDTO dto = new PromoDTO(
                    promo.getId(),
                    promo.getPercent(),
                    promo.getStartDate(),
                    promo.getEndDate(),
                    promo.getRestaurant().getId(),
                    promo.getRestaurant().getTitle()
            );
            listDTO.add(dto);
        }
        return listDTO;
    }
}
