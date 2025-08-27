package com.rgpay.pos.core.utils

object ValidationUtils {
    
    fun isValidEmail(email: String): Boolean {
        val emailRegex = Regex("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}\$")
        return emailRegex.matches(email)
    }
    
    fun isValidApiKey(apiKey: String): Boolean {
        return apiKey.isNotBlank() && apiKey.length >= 6
    }
    
    fun isValidTableId(tableId: String): Boolean {
        return tableId.isNotBlank() && tableId.length <= 10
    }
    
    fun isValidDeviceName(deviceName: String): Boolean {
        return deviceName.isNotBlank() && 
               deviceName.length <= 50 &&
               !deviceName.contains("\n")
    }
    
    fun isValidLocationName(locationName: String): Boolean {
        return locationName.isNotBlank() && 
               locationName.length <= 50 &&
               !locationName.contains("\n")
    }
    
    fun isValidSerialNumber(serialNumber: String): Boolean {
        val serialRegex = Regex("^[a-zA-Z0-9_-]*$")
        return serialNumber.isNotBlank() && 
               serialNumber.length <= 20 &&
               serialRegex.matches(serialNumber)
    }
}
