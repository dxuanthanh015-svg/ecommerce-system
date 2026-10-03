package com.thanhhandsome.backend.converter;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import tools.jackson.databind.ObjectMapper;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Converter
public class StringListConverter implements AttributeConverter<List<String>, String> {

    private final ObjectMapper objectMapper = new ObjectMapper();
    @Override
    public String convertToDatabaseColumn(List<String> attribute) {
        if(attribute == null || attribute.isEmpty()) {
            return "[]";
        }
        try {
            return objectMapper.writeValueAsString(attribute);
        }catch (Exception e){
            return "[]";
        }
    }

    @Override
    public List<String> convertToEntityAttribute(String dbData) {
        if(dbData == null || dbData.isEmpty()) {
            return Collections.emptyList();
        }
        try {
            return objectMapper.readValue(dbData, List.class);
        }catch (Exception e){
            return Collections.emptyList();
        }
    }
}
