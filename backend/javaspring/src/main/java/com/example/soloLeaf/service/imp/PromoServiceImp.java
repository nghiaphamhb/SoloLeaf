package com.example.soloLeaf.service.imp;

import com.example.soloLeaf.dto.PromoDTO;

import java.util.List;

public interface PromoServiceImp {
    List<PromoDTO> getAllUnusedPromo();
    PromoDTO generatePromo();
}
