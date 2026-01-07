package com.example.soloLeaf.service.imp;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

public interface FileServiceImp {
    String saveFile(MultipartFile file);
}
