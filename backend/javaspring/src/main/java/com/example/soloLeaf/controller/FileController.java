package com.example.soloLeaf.controller;

import com.example.soloLeaf.payload.ResponseData;
import com.example.soloLeaf.service.imp.FileServiceImp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/file")
public class FileController {
    @Autowired
    private FileServiceImp fileServiceImp;

    @PostMapping()
    public ResponseEntity<?> uploadFile(@RequestParam MultipartFile file) {
        ResponseData responseData = new ResponseData();

        String url = fileServiceImp.saveFile(file);
        responseData.setSuccess(url != null);
        responseData.setData(url);

        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

//    @GetMapping("/download/{filename:.+}")
//    public ResponseEntity<?> downloadFile(@PathVariable String filename) {
//        Resource resource = fileServiceImp.loadFile(filename);
//        return ResponseEntity.ok()
//                .header(HttpHeaders.CONTENT_DISPOSITION,
//                        "attachment; filename=\"" +resource.getFilename() + "\"")
//                .body(resource);
//    }
}
