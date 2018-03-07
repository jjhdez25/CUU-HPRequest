
#region Usings
using System;

using System.Data;
using System.Data.Common;
using System.Data.Odbc;
using System.Data.SqlClient;
using System.Data.OleDb;
using System.Data.OracleClient;

#endregion

    /// <summary>
    /// Clase unica para manejo de transacciones a las diferentes base de datos
    /// </summary>
    public class DataAccess
    {
        #region Enumerable
        /// <summary>
        /// Enlaces a objetos de base de datos
        /// </summary>
        /// <option name="sql">Manejador SQLServer</option>
        /// <option name="odbc">Open DataBase Connectivity - Manejador MySQL</option>
        /// <option name="oledb">Object Linking and Embedding for Databases - Manejador Office</option>
        /// <option name="oradb">	Oracle Database API - manejador Oracle</option>
        public enum BBDD
                        {
                            sql  = 1,
                            odbc = 2,
                            oledb= 3,
                            oradb= 4
                        }

        /// <summary>
        /// Opciones para cambiar en cadenas de conexion
        /// </summary>
        /// <option name="ApplicationName">nombre de aplicación que usara la cadena de conexion</option>
        /// <option name="InitialCatalog">nombre de la base de datos</option>
        /// <option name="DataSource">nombre o direccion del servidor</option>
        public enum Options
                        {
                            ApplicationName,
                            InitialCatalog,
                            DataSource
                        }
        #endregion

        #region Public Statements
            /// <summary>
            /// Parametros publicos usados para ejecutar instrucciones y transacciones en la base de datos
            /// </summary>
            public IDbDataParameter[] Parameters;
        #endregion

        #region Private Statements
            private IDbConnection Conection = null;
            private static DbConnectionStringBuilder Builder;
            private IDbCommand Command = null;
            private IDbTransaction Transaction = null;
            private string ConnString;
            private DbProviderFactory Factory = null;
            private BBDD TypeDB;
            private DataTable dtData;
            private static DataSet dsData;
            private IDataReader Reader;
        #endregion

        #region Public Properties
            public DataTable TableResult
            {
                get { return dtData; }
                set { dtData = value; }
            }
           
            public DataSet TablesResult
            {
                get { return dsData; }
                set { dsData = value; }
            }
        #endregion

        #region Builders class
            /// <summary>
            /// Constructor de la clase con cadena de conexion
            /// </summary>
            /// <param name="ConnectionType">Tipo de base de datos</param>
            /// <param name="strConn">Cadena de conexion</param>
            public DataAccess(BBDD ConnectionType, string strConn)
            {
	            try {
		            string proveedor = "";

		            TypeDB = ConnectionType;
		            switch (this.TypeDB) {
			            case BBDD.sql:
				            proveedor = "System.Data.SqlClient";
				            break;
			            case BBDD.odbc:
				            proveedor = "System.Data.Odbc";
				            break;
			            case BBDD.oledb:
				            proveedor = "System.Data.Oledb";
				            break;
			            case BBDD.oradb:
				            proveedor = "System.Data.OracleClient";
				            break;
		            }

		            this.ConnString = strConn;
		            this.Factory = DbProviderFactories.GetFactory(proveedor);
		            Parameters = null;

	            } catch (Exception ex) {
		            throw new ClassDataException(ex.Message + Environment.NewLine + " ClassData.New(Connectiontype,ConnectionString) ", ex);
	            }
            }
        #endregion

        #region Open/Close Connection
            /// <summary>
            /// Este es el metodo encargado de realizar el Connect con la base de datos
            /// </summary>
            public void Connect()
            {
                try
                {
                    if ((Conection != null))
                    {
                        if (Conection.State.Equals(ConnectionState.Closed))
                        {
                            throw new ClassDataException("This connection it's already open");
                        }
                    }

                    if (Conection == null)
                    {
                        switch (TypeDB)
                        {
                            case BBDD.sql:
                                Conection = new SqlConnection();
                                break;
                            case BBDD.odbc:
                                Conection = new OdbcConnection();
                                break;
                            case BBDD.oledb:
                                Conection = new SqlConnection();
                                break;
                            case BBDD.oradb:
                                Conection = new OracleConnection();
                                break;
                        }
                        Conection = Factory.CreateConnection();
                        Conection.ConnectionString = ConnString;
                    }

                    this.Conection.Open();

                }
                catch (Exception ex)
                {
                    throw new ClassDataException(ex.Message + Environment.NewLine + " Connection string " + this.ConnString + Environment.NewLine + " DataAccess.Connect ", ex);
                }
            }

            /// <summary>
            /// Este es el metodo encargado de realizar el DisConnect con la base de datos
            /// </summary>
            public void Disconnect()
            {
                try
                {
                    if (this.Conection.State.Equals(ConnectionState.Open))
                    {
                        this.Conection.Close();
                        this.Conection = null;
                    }

                }
                catch (DataException ex)
                {
                    this.Conection = null;
                    throw new ClassDataException(ex.Message + Environment.NewLine + " DataAccess.Disconnect ", ex);
                }
                catch (InvalidOperationException ex)
                {
                    this.Conection = null;
                    throw new ClassDataException(ex.Message + Environment.NewLine + " DataAccess.Disconnect ", ex);
                }

            }

        #endregion

        #region Transactions
            /// <summary>
            /// Metodo Encagrado para Iniciar una transaccion en la base de datos
            /// </summary>
            public void BeginTransaction()
            {
                if (this.Transaction == null)
                {
                    this.Transaction = this.Conection.BeginTransaction();
                }
            }
            /// <summary>
            /// Metodo Encagrado para Cancelar una transaccion en la base de datos
            /// </summary>
            public void CancelTransaction()
            {
                if ((this.Transaction != null))
                {
                    this.Transaction.Rollback();
                }
            }
            /// <summary>
            /// Metodo Encagrado para Confirmar una transaccion en la base de datos
            /// </summary>
            public void CommitTransaction()
            {
                if ((this.Transaction != null))
                {
                    this.Transaction.Commit();
                }
            }
        #endregion

        #region Add Parameters
            /// <summary>
            /// Esta funcion debemos de llamarla antes que la funcion para devolver los datos
            /// </summary>
            /// <param name="Index">indicar el indice del parametro que se agrega</param>
            /// <param name="Name">nombre del parametro</param>
            /// <param name="DT">indica el tipo de dato del parametro</param>
            /// <param name="Value">indica el valor del parametro</param>
            /// <returns>Regresa True/False indicando si el parametro se agrego correctamente o no</returns>
            public bool AddParameter(int Index, string Name, DbType DT, object Value, ParameterDirection ParamDirection = ParameterDirection.Input)
            {
                bool functionReturnValue = false;
                try
                {
                    Array.Resize(ref Parameters, Index + 1);

                    switch (TypeDB)
                    {
                        case BBDD.sql:
                            Parameters[Index] = new SqlParameter();
                            break;
                        case BBDD.odbc:
                            Parameters[Index] = new OdbcParameter();
                            break;
                        case BBDD.oledb:
                            Parameters[Index] = new OleDbParameter();
                            break;
                        case BBDD.oradb:
                            Parameters[Index] = new OracleParameter();
                            break;
                    }

                    Parameters[Index].ParameterName = Name;
                    Parameters[Index].DbType = DT;
                    Parameters[Index].Direction = ParamDirection;
                    Parameters[Index].Value = Value;

                    functionReturnValue = true;

                }
                catch (Exception ex)
                {
                    functionReturnValue = false;
                    throw new ClassDataException(ex.Message + Environment.NewLine + " ClassData.AddParameter", ex);
                }

                return functionReturnValue;
            }

            /// <summary>
            /// Metodo encargado de eliminar los parametros
            /// </summary>
            public void RemoveParameters()
            {
                Parameters = null;
            }
        #endregion

        #region Querys
            /// <summary>
            /// Funcion que ejecuta una instruccion en la base de datos
            /// </summary>
            /// <param name="strSQL">instrucción a ejecutar</param>
            /// <returns>regresa objeto dataadapter</returns>
            private IDataAdapter ExecuteQueryaDataAdapter(string strSQL)
            {
                IDataAdapter functionReturnValue = default(IDataAdapter);
                try
                {
                    switch (TypeDB)
                    {
                        case BBDD.sql:
                            functionReturnValue = new SqlDataAdapter(strSQL, ConnString);
                            break;
                        case BBDD.odbc:
                            functionReturnValue = new OdbcDataAdapter(strSQL, ConnString);
                            break;
                        case BBDD.oledb:
                            functionReturnValue = new OleDbDataAdapter(strSQL, ConnString);
                            break;
                        case BBDD.oradb:
                            functionReturnValue = new OracleDataAdapter(strSQL, ConnString);
                            break;
                    }
                }
                catch (Exception ex)
                {
                    throw new ClassDataException(ex.Message + Environment.NewLine + " ClassData.ExecuteQueryaDataAdapter ", ex);
                }
                return functionReturnValue;
            }

            /// <summary>
            /// Funcion que ejecuta una instruccion en la base de datos
            /// </summary>
            /// <param name="strSQL">objeto command que contiene la instruccion a ejecutar y sus parametros</param>
            /// <returns>regresa objeto dataadapter</returns>
            private IDataAdapter ExecuteQueryaDataAdapter(IDbCommand comm)
            {
                IDataAdapter functionReturnValue = default(IDataAdapter);
                try
                {
                    switch (TypeDB)
                    {
                        case BBDD.sql:
                            functionReturnValue = new SqlDataAdapter((System.Data.SqlClient.SqlCommand)comm);
                            break;
                        case BBDD.odbc:
                            functionReturnValue = new OdbcDataAdapter((System.Data.Odbc.OdbcCommand)comm);
                            break;
                        case BBDD.oledb:
                            functionReturnValue = new OleDbDataAdapter((System.Data.OleDb.OleDbCommand)comm);
                            break;
                        case BBDD.oradb:
                            functionReturnValue = new OracleDataAdapter((System.Data.OracleClient.OracleCommand)comm);
                            break;
                    }

                }
                catch (Exception ex)
                {
                    throw new ClassDataException(ex.Message + Environment.NewLine + " ClassData.ExecuteQueryaDataAdapter ", ex);
                }
                return functionReturnValue;
            }
        #endregion

        #region Execute Instructions / Sentences
            /// <summary>
            /// Metodo encargado de crear el command de base de datos
            /// </summary>
            /// <param name="strSQL">Cadena SQL a ejecutar EJ1:Nombre de SP, EJ2: Select * Form...</param>
            /// <param name="DatatypeInstruction">Tipo de instruccion a ejecutar (P:Store Procedure - T:TableDirect - " "- (SELECT/INSERT/DELETE/UPDATE) </param>
            private void CreateCommand(string strSQL, CommandType DatatypeInstruction = CommandType.Text)
            {
                try
                {
                    switch (TypeDB)
                    {
                        case BBDD.sql:
                            this.Command = new SqlCommand();
                            break;
                        case BBDD.odbc:
                            this.Command = new OdbcCommand();
                            break;
                        case BBDD.oledb:
                            this.Command = new OleDbCommand();
                            break;
                        case BBDD.oradb:
                            this.Command = new OracleCommand();
                            break;
                    }

                    this.Command = Factory.CreateCommand();
                    this.Command.Connection = Conection;
                    this.Command.CommandTimeout = 99999999;
                    this.Command.CommandType = DatatypeInstruction;
                    this.Command.CommandText = strSQL;

                }
                catch (Exception ex)
                {
                    throw new ClassDataException(ex.Message + Environment.NewLine + " ClassData.CreateCommand ", ex);
                }
            }

            /// <summary>
            /// Metodo encargado de ejecutar el command de base de datos (ExecuteNonQuery)
            /// </summary>
            private void ExecuteCommand()
            {
                try
                {
                    this.Command.ExecuteNonQuery();
                }
                catch (Exception ex)
                {
                    throw new ClassDataException(ex.Message + Environment.NewLine + " ClassData.ExecuteCommand ", ex);
                }
            }

            /// <summary>
            /// funcion encargada de crear y ejecutar el command de base de datos
            /// </summary>
            /// <param name="strSQL">Cadena SQL a ejecutar EJ1:Nombre de SP, EJ2: Select * Form...</param>
            /// <param name="commType">tipo de sentencia a ejecutar. ej. Storedprocedure</param>
            public bool ExecuteSentence(string strSQL, CommandType commType)
            {
                bool functionReturnValue = false;
                try
                {
                    this.CreateCommand(strSQL, commType);
                    this.ExecuteCommand();
                    functionReturnValue = true;
                }
                catch (Exception ex)
                {
                    functionReturnValue = false;
                    throw new ClassDataException(ex.Message + Environment.NewLine + " ClassData.ExecuteSentence ", ex);
                }
                return functionReturnValue;
            }
        #endregion

        #region Execute Stored Procedure
            /// <summary>
            /// Funcion que ejecuta un Procedimiento almacenado de base de datos [INSERT/DELETE/UPDATE]
            /// </summary>
            /// <param name="NameStoreProcedure">Nombre del procedimiento almacenado</param>
            /// <param name="ParametersExist">Indica si existen o no parametros para el procedimiento almacenado</param>
            /// <returns>Regresa True/False si el Procedimiento almacenado se ejecuta o no</returns>
            public bool ExecuteStoredProcedure(string NameStoreProcedure, bool ParametersExist)
            {
                bool functionReturnValue = false;
                functionReturnValue = false;
                //Esta instancia ejecuta un procedimiento almacenado 

                try
                {
                    int i = 0;
                    CreateCommand(NameStoreProcedure, CommandType.StoredProcedure);

                    if (ParametersExist)
                    {
                        while (i <= Parameters.GetUpperBound(0))
                        {
                            this.Command.Parameters.Add(Parameters[i]);
                            i = i + 1;
                        }
                    }

                    if (this.Command.ExecuteNonQuery() != 0)
                    {
                        return true;
                    }

                }
                catch (Exception ex)
                {
                    throw new ClassDataException(ex.Message + Environment.NewLine + " ClassData.ExecuteStoredProcedure", ex);

                }
                return functionReturnValue;
            }

            /// <summary>
            /// Funcion que ejecuta un Procedimiento almacenado de base de datos y llena un DataTable con el resultado
            /// </summary>
            /// <param name="NameStoreProcedure">Nombre del procedimiento almacenado</param>
            /// <param name="ParametersExist">Indica si existen o no parametros para el procedimiento almacenado</param>
            /// <returns>Regresa True/False si el Procedimiento almacenado se ejecuta o no</returns>
            public bool ExecuteStoredProcedureGetDataTable(string NameStoreProcedure, bool ParametersExist)
            {
                bool functionReturnValue = false;

                IDataAdapter arsDatos = default(IDataAdapter);
                DataSet datos = new DataSet();
                functionReturnValue = false;

                //Esta instancia ejecuta un procedimiento almacenado SELECT
                try
                {
                    switch (TypeDB)
                    {
                        case BBDD.sql:
                            arsDatos = new SqlDataAdapter();
                            break;
                        case BBDD.odbc:
                            arsDatos = new OdbcDataAdapter();
                            break;
                        case BBDD.oledb:
                            arsDatos = new OleDbDataAdapter();
                            break;
                        case BBDD.oradb:
                            arsDatos = new OracleDataAdapter();
                            break;
                    }

                    CreateCommand(NameStoreProcedure, CommandType.StoredProcedure);

                    if (ParametersExist)
                    {
                        int i = 0;
                        while (i <= Parameters.GetUpperBound(0))
                        {
                            this.Command.Parameters.Add(Parameters[i]);
                            i = i + 1;
                        }
                    }

                    arsDatos = ExecuteQueryaDataAdapter(this.Command);

                    arsDatos.Fill(datos);

                    if (datos.Tables.Count > 0)
                    {
                        dtData = datos.Tables[0];
                    }
                    return true;

                }
                catch (Exception ex)
                {
                    throw new ClassDataException(ex.Message + Environment.NewLine + " ClassData.ExecuteStoredProcedureGetDataTable", ex);
                }
                return functionReturnValue;
            }

            /// <summary>
            /// Funcion que ejecuta un Procedimiento almacenado de base de datos y llena un DataSet con el resultado
            /// </summary>
            /// <param name="NameStoreProcedure">Nombre del procedimiento almacenado</param>
            /// <param name="ParametersExist">Indica si existen o no parametros para el procedimiento almacenado</param>
            /// <returns>Regresa True/False si el Procedimiento almacenado se ejecuta o no</returns>
            public bool ExecuteStoredProcedureGetDataSet(string NameStoreProcedure, bool ParametersExist)
            {
                bool functionReturnValue = false;
                IDataAdapter arsDatos = default(IDataAdapter);
                dsData = new DataSet();
                functionReturnValue = false;
                try
                {
                    switch (TypeDB)
                    {
                        case BBDD.sql:
                            arsDatos = new SqlDataAdapter();
                            break;
                        case BBDD.odbc:
                            arsDatos = new OdbcDataAdapter();
                            break;
                        case BBDD.oledb:
                            arsDatos = new OleDbDataAdapter();
                            break;
                        case BBDD.oradb:
                            arsDatos = new OracleDataAdapter();
                            break;
                    }

                    CreateCommand(NameStoreProcedure, CommandType.StoredProcedure);

                    if (ParametersExist)
                    {
                        int i = 0;
                        while (i <= Parameters.GetUpperBound(0))
                        {
                            this.Command.Parameters.Add(Parameters[i]);
                            i = i + 1;
                        }
                    }

                    arsDatos = ExecuteQueryaDataAdapter(this.Command);
                    arsDatos.Fill(dsData);
                    return true;

                }
                catch (Exception ex)
                {
                    throw new ClassDataException(ex.Message + Environment.NewLine + " ClassData.ExecuteStoredProcedureGetDataSet", ex);
                }
                return functionReturnValue;

            }

            /// <summary>
            /// Funcion que ejecuta un Procedimiento almacenado de base de datos y regresa un datareader
            /// </summary>
            /// <param name="NameStoreProcedure">Nombre del procedimiento almacenado</param>
            /// <param name="ParametersExist">Indica si existen o no parametros para el procedimiento almacenado</param>
            /// <returns>Regresa un datareader que almacena el resultado del SP</returns>
            public IDataReader ExecuteStoredProcedureGetDataReader(string NameStoreProcedure, bool ParametersExist)
            {
               try
                {
                    CreateCommand(NameStoreProcedure, CommandType.StoredProcedure);

                    if (ParametersExist)
                    {
                        int i = 0;
                        while (i <= Parameters.GetUpperBound(0))
                        {
                            this.Command.Parameters.Add(Parameters[i]);
                            i = i + 1;
                        }
                    }

                    return this.Command.ExecuteReader();

                }
                catch (Exception ex)
                {
                    throw new ClassDataException(ex.Message + Environment.NewLine + " ClassData.ExecuteStoredProcedureGetDataReader", ex);
                }

            }

        #endregion

    
}
