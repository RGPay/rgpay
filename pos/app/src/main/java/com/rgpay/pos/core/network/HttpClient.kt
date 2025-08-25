package com.rgpay.pos.core.network

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import java.io.IOException
import java.net.HttpURLConnection
import java.net.URL

class HttpClient {
    
    suspend fun get(url: String, headers: Map<String, String> = emptyMap()): String {
        return withContext(Dispatchers.IO) {
            val connection = URL(url).openConnection() as HttpURLConnection
            connection.requestMethod = "GET"
            
            headers.forEach { (key, value) ->
                connection.setRequestProperty(key, value)
            }
            
            try {
                val responseCode = connection.responseCode
                if (responseCode == HttpURLConnection.HTTP_OK) {
                    connection.inputStream.bufferedReader().use { it.readText() }
                } else {
                    throw IOException("HTTP $responseCode: ${connection.responseMessage}")
                }
            } finally {
                connection.disconnect()
            }
        }
    }
    
    suspend fun post(url: String, data: String, headers: Map<String, String> = emptyMap()): String {
        return withContext(Dispatchers.IO) {
            val connection = URL(url).openConnection() as HttpURLConnection
            connection.requestMethod = "POST"
            connection.doOutput = true
            
            headers.forEach { (key, value) ->
                connection.setRequestProperty(key, value)
            }
            
            try {
                connection.outputStream.use { os ->
                    os.write(data.toByteArray())
                }
                
                val responseCode = connection.responseCode
                if (responseCode in 200..299) {
                    connection.inputStream.bufferedReader().use { it.readText() }
                } else {
                    throw IOException("HTTP $responseCode: ${connection.responseMessage}")
                }
            } finally {
                connection.disconnect()
            }
        }
    }
    
    suspend fun put(url: String, data: String, headers: Map<String, String> = emptyMap()): String {
        return withContext(Dispatchers.IO) {
            val connection = URL(url).openConnection() as HttpURLConnection
            connection.requestMethod = "PUT"
            connection.doOutput = true
            
            headers.forEach { (key, value) ->
                connection.setRequestProperty(key, value)
            }
            
            try {
                connection.outputStream.use { os ->
                    os.write(data.toByteArray())
                }
                
                val responseCode = connection.responseCode
                if (responseCode in 200..299) {
                    connection.inputStream.bufferedReader().use { it.readText() }
                } else {
                    throw IOException("HTTP $responseCode: ${connection.responseMessage}")
                }
            } finally {
                connection.disconnect()
            }
        }
    }
}
